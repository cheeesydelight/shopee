import { db, ref, get, child } from "./firebase-config.js"; 
// Password visibility toggle
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

// Utility functions
function showError(message) {
  const form = document.getElementById("loginForm")
  let errorDiv = form.querySelector(".error-message")

  if (!errorDiv) {
    errorDiv = document.createElement("div")
    errorDiv.className = "error-message"
    form.insertBefore(errorDiv, form.firstChild)
  }

  errorDiv.textContent = message
  setTimeout(() => {
    if (errorDiv.parentNode) {
      errorDiv.remove()
    }
  }, 5000)
}

function showSuccess(message) {
  const form = document.getElementById("loginForm")
  let successDiv = form.querySelector(".success-message")

  if (!successDiv) {
    successDiv = document.createElement("div")
    successDiv.className = "success-message"
    form.insertBefore(successDiv, form.firstChild)
  }

  successDiv.textContent = message
  setTimeout(() => {
    if (successDiv.parentNode) {
      successDiv.remove()
    }
  }, 5000)
}

// Event listeners
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;

    if (!username) {
      showError("Please enter your username");
      return;
    }

    if (!password) {
      showError("Please enter your password");
      return;
    }

    const loginBtn = document.querySelector(".btn-login");
    loginBtn.classList.add("loading");

    try {
      const snapshot = await get(child(ref(db), "users"));
      if (snapshot.exists()) {
        const users = snapshot.val();
        const matchedUser = Object.values(users).find(user => user.username === username && user.password === password);

        if (matchedUser) {
          showSuccess("Login successful! Redirecting...");
          setTimeout(() => {
            window.location.href = "admin.html"; // ✅ redirect
          }, 1500);
        } else {
          showError("Invalid username or password");
        }
      } else {
        showError("No users found in database");
      }
    } catch (error) {
      console.error("Firebase error:", error);
      showError("Login failed. Try again later.");
    } finally {
      loginBtn.classList.remove("loading");
    }
  });
});






// document.addEventListener("keypress", (e) => {
//     if (e.key === "Enter") {
//       document.getElementById("loginForm").dispatchEvent(new Event("submit"))
//     }
//   }
