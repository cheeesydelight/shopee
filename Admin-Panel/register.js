import { db, ref, set } from "./firebase-config.js";
// Global variables
let currentStep = 1

// Step navigation functions
function goToBasicInfo() {
  showStep("basicInfo")
  currentStep = 1
}

window.goToEmailVerification = function () {
  // Validate basic info first
  if (!validateBasicInfo()) {
    return
  }
  showStep("emailVerification")
  currentStep = 2
}

function goToPasswordSetup() {
  showStep("passwordSetup")
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
function validateBasicInfo() {
  const name = document.getElementById("fullName").value.trim()
  const username = document.getElementById("username").value.trim()
  const phone = document.getElementById("phoneNumber").value.trim()

  if (!name) {
    showError("Please enter your full name", "basicInfo")
    return false
  }

  if (!username) {
    showError("Please enter a username", "basicInfo")
    return false
  }

  if (username.length < 3) {
    showError("Username must be at least 3 characters long", "basicInfo")
    return false
  }

  if (!phone) {
    showError("Please enter your phone number", "basicInfo")
    return false
  }

  if (!isValidPhone(phone)) {
    showError("Please enter a valid phone number", "basicInfo")
    return false
  }

  return true
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

function isValidPhone(phone) {
  const phoneRegex = /^[+]?[1-9][\d]{0,15}$/
  return phoneRegex.test(phone.replace(/\s/g, ""))
}

// Phone number formatting
function formatPhoneNumber(input) {
  input.value = input.value.replace(/\D/g, "").slice(0, 10)
}


// OTP functions (UI only - no actual implementation)
let generatedOTP = ""

function sendOTP() {
  const email = document.getElementById("email").value.trim()

  if (!email) {
    showError("Please enter your email address", "emailVerification")
    return
  }

  if (!isValidEmail(email)) {
    showError("Please enter a valid email address", "emailVerification")
    return
  }

  // Generate 6-digit OTP
  generatedOTP = Math.floor(100000 + Math.random() * 900000).toString()

  // Disable button + show loader
  const sendBtn = document.getElementById("sendOtpBtn")
  sendBtn.classList.add("loading")

  // Initialize EmailJS if not already done
  if (!emailjs.__initialized) {
    emailjs.init("EYO3o-qZS68NQnOHh") // replace with your actual public key
    emailjs.__initialized = true
  }

 const expiryTime = new Date(Date.now() + 15 * 60000).toLocaleTimeString();

emailjs.send("service_keyl2xb", "template_1ymgkqb", {
    to_email: email,           // this will replace {{to_email}}
  otp: generatedOTP,         // this will replace {{otp}}
  expiry: expiryTime         // this will replace {{expiry}}
})

  .then(() => {
    sendBtn.classList.remove("loading")
    document.getElementById("otpSection").style.display = "block"
    document.getElementById("emailDisplay").textContent = email
    showSuccess("OTP sent to your email!", "emailVerification")
    startOTPTimer()
  })
  .catch((err) => {
    console.error("EmailJS Error:", err)
    sendBtn.classList.remove("loading")
    showError("Failed to send OTP. Try again.", "emailVerification")
  })
}




function resendOTP() {
  // Clear OTP inputs
  document.querySelectorAll(".otp-input").forEach((input) => {
    input.value = ""
  })

  showSuccess("New verification code sent to your email!", "emailVerification")
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

function verifyOTP() {
  const otpInputs = document.querySelectorAll(".otp-input")
  const otpValue = Array.from(otpInputs)
    .map((input) => input.value)
    .join("")

  if (otpValue.length !== 6) {
    showError("Please enter the complete 6-digit code", "emailVerification")
    return
  }

  // Just show success and proceed (no actual verification)
  showSuccess("Email address verified successfully!", "emailVerification")

  // Auto proceed to password setup
  setTimeout(() => {
    goToPasswordSetup()
  }, 1500)
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
  const password = document.getElementById("password").value
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
  const password = document.getElementById("password").value
  const confirmPassword = document.getElementById("confirmPassword").value
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
  alert("Redirecting to login page...");
  window.location.href = 'login.html';
}


// Event listeners
document.addEventListener("DOMContentLoaded", () => {
  // Phone number formatting
  document.getElementById("phoneNumber").addEventListener("input", function () {
    formatPhoneNumber(this)
  })

  // Phone number validation
  document.getElementById("phoneNumber").addEventListener("blur", function () {
    const phone = this.value.trim()
    const status = document.getElementById("phoneStatus")

    if (phone && isValidPhone(phone)) {
      status.textContent = "✓ Valid"
      status.className = "input-status valid"
    } else if (phone) {
      status.textContent = "✗ Invalid"
      status.className = "input-status invalid"
    } else {
      status.textContent = ""
    }
  })

  // Password strength checking
  document.getElementById("password").addEventListener("input", updatePasswordStrength)

  // Password confirmation checking
  document.getElementById("confirmPassword").addEventListener("input", validatePasswordMatch)

  // Username availability checking (simulated)
  document.getElementById("username").addEventListener("blur", function () {
    const username = this.value.trim()
    const status = document.getElementById("usernameStatus")

    if (username.length >= 3) {
      // Simulate API call
      setTimeout(() => {
        // Random availability for demo
        const isAvailable = Math.random() > 0.3
        if (isAvailable) {
          status.textContent = "✓ Available"
          status.className = "input-status valid"
        } else {
          status.textContent = "✗ Taken"
          status.className = "input-status invalid"
        }
      }, 500)
    } else {
      status.textContent = ""
    }
  })

  // Email validation
  document.getElementById("email").addEventListener("blur", function () {
    const email = this.value.trim()
    const status = document.getElementById("emailStatus")

    if (email && isValidEmail(email)) {
      status.textContent = "✓ Valid"
      status.className = "input-status valid"
    } else if (email) {
      status.textContent = "✗ Invalid"
      status.className = "input-status invalid"
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
  document.getElementById("registrationForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  const requirements = checkPasswordStrength(password);

  // ✅ Validate password strength
  const metCount = Object.values(requirements).filter(Boolean).length;
  if (metCount < 4) {
    showError("Password does not meet minimum requirements", "passwordSetup");
    return;
  }

  if (password !== confirmPassword) {
    showError("Passwords do not match", "passwordSetup");
    return;
  }

  const registerBtn = document.getElementById("registerBtn");
  registerBtn.classList.add("loading");

  // ✅ Gather user data
 const fullName = document.getElementById("fullName").value.trim();
const rawUsername = document.getElementById("username").value.trim();
const phone = document.getElementById("phoneNumber").value.trim();
const email = document.getElementById("email").value.trim();


const safeUsername = rawUsername.replace(/[.#$\[\]@]/g, "_");
const userId = safeUsername + "_" + Date.now();

set(ref(db, "users/" + userId), {
  fullName,
  username: rawUsername,
  phone,
  email,
  password,
  createdAt: new Date().toISOString()
})

    .then(() => {
      registerBtn.classList.remove("loading");

      // ✅ Show success
      document.getElementById("passwordSetup").classList.remove("active");
      document.getElementById("successSection").style.display = "block";
      setTimeout(() => {
        document.getElementById("successSection").classList.add("active");
      }, 100);
    })
    .catch((error) => {
      console.error("Firebase Error:", error);
      registerBtn.classList.remove("loading");
      showError("Failed to save user data. Please try again.", "passwordSetup");
    });
  });
}); // <-- Correctly close the DOMContentLoaded event listener

function startOTPTimer() {
  const timerElement = document.getElementById("timer");
  const resendBtn = document.getElementById("resendBtn");
  let timeLeft = 60;

  resendBtn.disabled = true;
  timerElement.textContent = timeLeft;

  const countdown = setInterval(() => {
    timeLeft--;
    timerElement.textContent = timeLeft;

    if (timeLeft <= 0) {
      clearInterval(countdown);
      resendBtn.disabled = false;
      timerElement.textContent = "0";
    }
  }, 1000);
}


window.goToBasicInfo = goToBasicInfo;
window.sendOTP = sendOTP;
window.resendOTP = resendOTP;
window.verifyOTP = verifyOTP;
window.togglePassword = togglePassword;
window.redirectToLogin = redirectToLogin;
window.startOTPTimer = startOTPTimer;
window.moveToNext = moveToNext;




