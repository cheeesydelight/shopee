
import {
  ref,
  set,
  update,
  db,
  get,
  child
} from "./firebase-config.js";

// Global variables
let currentStep = 1

// Step navigation functions
function goToEmailSection() {
  showStep("emailSection")
  currentStep = 1
}

function goToOTPSection() {
  showStep("otpSection")
  currentStep = 2
}

function goToPasswordSection() {
  showStep("passwordSection")
  currentStep = 3
}

function showStep(stepId) {
  // Hide all sections
  document.querySelectorAll(".form-section").forEach((section) => {
    section.classList.remove("active")
  })

  // Show target section
  setTimeout(() => {
    document.getElementById(stepId).classList.add("active")
  }, 250)
}

// Validation functions
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

function isValidUsername(username) {
  return username.length >= 3 && /^[a-zA-Z0-9_]+$/.test(username)
}

// OTP functions (UI only - no actual implementation)
let currentOTP = "";  // Store the OTP globally

let emailjsInitialized = false;

function sendResetOTP() {
  const emailOrUsername = document.getElementById("emailOrUsername").value.trim()

  if (!emailOrUsername) {
    showError("Please enter your email address or username", "emailSection")
    return
  }

  const isEmail = isValidEmail(emailOrUsername)
  const isUsername = isValidUsername(emailOrUsername)

  if (!isEmail && !isUsername) {
    showError("Please enter a valid email address or username", "emailSection")
    return
  }

  const sendBtn = document.getElementById("sendOtpBtn")
  sendBtn.classList.add("loading")

  const otp = Math.floor(100000 + Math.random() * 900000).toString()
  const expiry = Date.now() + 15 * 60 * 1000 // Valid for 15 mins

  // ✅ Save OTP in Firebase
  const safeKey = emailOrUsername.replace(/\./g, '_')
  set(ref(db, "reset_otps/" + safeKey), {
    otp: otp,
    expiry: expiry
  })

  // ✅ Initialize EmailJS (once)
  if (!emailjsInitialized) {
    emailjs.init("EYO3o-qZS68NQnOHh") // 🔁 Use your actual public key
    emailjsInitialized = true
  }

  // ✅ Send Email
  emailjs.send("service_keyl2xb", "template_4dlvs39", {
    to_email: emailOrUsername,
    otp: otp,
    expiry: new Date(expiry).toLocaleTimeString()
  })
    .then(() => {
      sendBtn.classList.remove("loading")

      const contactDisplay = document.getElementById("contactDisplay")
      contactDisplay.textContent = emailOrUsername

      goToOTPSection()
      showSuccess("Reset code sent successfully!", "otpSection")
    })
    .catch((error) => {
      console.error("EmailJS Error:", error)
      sendBtn.classList.remove("loading")
      showError("Failed to send reset code. Please try again.", "emailSection")
    })
}


function resendResetOTP() {
  // Clear OTP inputs
  document.querySelectorAll(".otp-input").forEach((input) => {
    input.value = ""
  })

  showSuccess("New reset code sent!", "otpSection")
}

function moveToNext(current, index) {
  if (current.value.length === 1 && index < 5) {
    const nextInput = document.querySelectorAll(".otp-input")[index + 1]
    if (nextInput) nextInput.focus()
  }

  // Check if all OTP fields are filled
  const otpInputs = document.querySelectorAll(".otp-input")
  const otpValue = Array.from(otpInputs)
    .map((input) => input.value)
    .join("")

  const verifyBtn = document.getElementById("verifyBtn")
  verifyBtn.disabled = otpValue.length !== 6
}

function verifyResetOTP() {
  const enteredOTP = Array.from(document.querySelectorAll(".otp-input"))
    .map(input => input.value)
    .join("")

  if (enteredOTP.length !== 6) {
    showError("Please enter the complete 6-digit code", "otpSection")
    return
  }

  const emailOrUsername = document.getElementById("emailOrUsername").value.trim()
  const safeKey = emailOrUsername.replace(/\./g, '_')

  const dbRef = ref(db)

  get(child(dbRef, `reset_otps/${safeKey}`)).then((snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.val()

      if (Date.now() > data.expiry) {
        showError("OTP has expired", "otpSection")
      } else if (enteredOTP === data.otp) {
        showSuccess("Code verified successfully!", "otpSection")
        setTimeout(() => goToPasswordSection(), 1500)
      } else {
        showError("Incorrect OTP. Please try again.", "otpSection")
      }
    } else {
      showError("No OTP found. Please send again.", "otpSection")
    }
  }).catch((error) => {
    console.error("Error checking OTP:", error)
    showError("Something went wrong. Please try again.", "otpSection")
  })
}


// Password functions
function togglePassword(inputId) {
  const input = document.getElementById(inputId)
  const button = input.nextElementSibling.nextElementSibling

  if (input.type === "password") {
    input.type = "text"
    button.innerHTML = '<span class="eye-icon">🙈</span>'
  } else {
    input.type = "password"
    button.innerHTML = '<span class="eye-icon">👁️</span>'
  }
}

function checkPasswordStrength(password) {
  const requirements = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  }

  return requirements
}

function updatePasswordStrength() {
  const password = document.getElementById("newPassword").value
  const strengthFill = document.querySelector(".strength-fill")
  const requirements = checkPasswordStrength(password)

  // Update requirement indicators
  Object.keys(requirements).forEach((req) => {
    const element = document.getElementById(req + "Req")
    if (element) {
      element.classList.toggle("met", requirements[req])
    }
  })

  // Calculate strength percentage
  const metCount = Object.values(requirements).filter(Boolean).length
  const percentage = (metCount / 5) * 100

  strengthFill.style.width = percentage + "%"

  // Update color based on strength
  if (percentage < 40) {
    strengthFill.style.background = "#ff4757"
  } else if (percentage < 60) {
    strengthFill.style.background = "#ffa502"
  } else if (percentage < 80) {
    strengthFill.style.background = "#f39c12"
  } else {
    strengthFill.style.background = "#2ed573"
  }
}

function validatePasswordMatch() {
  const password = document.getElementById("newPassword").value
  const confirmPassword = document.getElementById("confirmNewPassword").value
  const status = document.getElementById("confirmPasswordStatus")

  if (confirmPassword.length === 0) {
    status.textContent = ""
    return
  }

  if (password === confirmPassword) {
    status.textContent = "✓"
    status.className = "input-status valid"
  } else {
    status.textContent = "✗"
    status.className = "input-status invalid"
  }
}

// Utility functions
function showError(message, sectionId) {
  const section = document.getElementById(sectionId)
  let errorDiv = section.querySelector(".error-message")

  if (!errorDiv) {
    errorDiv = document.createElement("div")
    errorDiv.className = "error-message"
    section.insertBefore(errorDiv, section.firstChild)
  }

  errorDiv.textContent = message
  setTimeout(() => {
    if (errorDiv.parentNode) {
      errorDiv.remove()
    }
  }, 5000)
}

function showSuccess(message, sectionId) {
  const section = document.getElementById(sectionId)
  let successDiv = section.querySelector(".success-message")

  if (!successDiv) {
    successDiv = document.createElement("div")
    successDiv.className = "success-message"
    section.insertBefore(successDiv, section.firstChild)
  }

  successDiv.textContent = message
  setTimeout(() => {
    if (successDiv.parentNode) {
      successDiv.remove()
    }
  }, 5000)
}

function redirectToLogin() {
  window.location.href = "login.html";
}


// Event listeners
document.addEventListener("DOMContentLoaded", () => {
  // Password strength checking
  document.getElementById("newPassword").addEventListener("input", updatePasswordStrength)

  // Password confirmation checking
  document.getElementById("confirmNewPassword").addEventListener("input", validatePasswordMatch)

  // Account validation
  document.getElementById("emailOrUsername").addEventListener("blur", function () {
    const value = this.value.trim()
    const status = document.getElementById("accountStatus")

    if (value) {
      const isEmail = isValidEmail(value)
      const isUsername = isValidUsername(value)

      if (isEmail || isUsername) {
        status.textContent = "✓ Valid"
        status.className = "input-status valid"
      } else {
        status.textContent = "✗ Invalid"
        status.className = "input-status invalid"
      }
    } else {
      status.textContent = ""
    }
  })

  // OTP input handling
  document.querySelectorAll(".otp-input").forEach((input, index) => {
    input.addEventListener("keydown", function (e) {
      if (e.key === "Backspace" && this.value === "" && index > 0) {
        document.querySelectorAll(".otp-input")[index - 1].focus()
      }
    })

    input.addEventListener("paste", (e) => {
      e.preventDefault()
      const pastedData = e.clipboardData.getData("text")
      const digits = pastedData.replace(/\D/g, "").slice(0, 6)

      document.querySelectorAll(".otp-input").forEach((otpInput, i) => {
        otpInput.value = digits[i] || ""
      })

      if (digits.length === 6) {
        document.getElementById("verifyBtn").disabled = false
      }
    })
  })

  // Form submission
  document.getElementById("forgotPasswordForm").addEventListener("submit", (e) => {
    e.preventDefault()

    const password = document.getElementById("newPassword").value
    const confirmPassword = document.getElementById("confirmNewPassword").value
    const requirements = checkPasswordStrength(password)

    // Validate password strength
    const metCount = Object.values(requirements).filter(Boolean).length
    if (metCount < 4) {
      showError("Password does not meet minimum requirements", "passwordSection")
      return
    }

    if (password !== confirmPassword) {
      showError("Passwords do not match", "passwordSection")
      return
    }

    // Show loading state
    const changePasswordBtn = document.getElementById("changePasswordBtn")
    changePasswordBtn.classList.add("loading")

    // Simulate password change
    const emailOrUsername = document.getElementById("emailOrUsername").value.trim();
const safeKey = emailOrUsername.replace(/\./g, '_'); // Used if email has dots

const dbRef = ref(db);

get(child(dbRef, "users")).then(snapshot => {
  if (snapshot.exists()) {
    let userFound = false;

    snapshot.forEach(childSnap => {
      const user = childSnap.val();
      if (user.email === emailOrUsername || user.username === emailOrUsername) {
        const userKey = childSnap.key;

        update(ref(db, `users/${userKey}`), {
          password: password  // You can hash this if needed
        }).then(() => {
          changePasswordBtn.classList.remove("loading");

          // ✅ Show success section
          document.getElementById("passwordSection").classList.remove("active");
          document.getElementById("successSection").style.display = "block";
          setTimeout(() => {
            document.getElementById("successSection").classList.add("active");
          }, 100);
        }).catch(err => {
          changePasswordBtn.classList.remove("loading");
          showError("Error updating password. Try again.", "passwordSection");
        });

        userFound = true;
      }
    });

    if (!userFound) {
      changePasswordBtn.classList.remove("loading");
      showError("User not found.", "passwordSection");
    }
  } else {
    changePasswordBtn.classList.remove("loading");
    showError("No users exist in database.", "passwordSection");
  }
}).catch(err => {
  changePasswordBtn.classList.remove("loading");
  showError("Firebase error occurred.", "passwordSection");
});
  })
})
window.sendResetOTP = sendResetOTP;
window.resendResetOTP = resendResetOTP;
window.moveToNext = moveToNext;
window.verifyResetOTP = verifyResetOTP;
window.togglePassword = togglePassword;
window.redirectToLogin = redirectToLogin;
window.goToEmailSection = goToEmailSection;
window.goToOTPSection = goToOTPSection;
window.goToPasswordSection = goToPasswordSection;
