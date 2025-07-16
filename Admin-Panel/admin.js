document.addEventListener("DOMContentLoaded", () => {
  // Elements
  const sidebarToggle = document.getElementById("sidebarToggle")
  const sidebar = document.getElementById("sidebar")
  const mainContent = document.querySelector(".main-content")
  const menuItems = document.querySelectorAll(".menu-item[data-section]")
  const contentSections = document.querySelectorAll(".content-section")

  // Sidebar toggle functionality
  sidebarToggle.addEventListener("click", () => {
    sidebar.classList.toggle("active")
    mainContent.classList.toggle("sidebar-open")

    // Animate hamburger menu
    const spans = sidebarToggle.querySelectorAll("span")
    spans.forEach((span, index) => {
      if (sidebar.classList.contains("active")) {
        if (index === 0) span.style.transform = "rotate(45deg) translate(5px, 5px)"
        if (index === 1) span.style.opacity = "0"
        if (index === 2) span.style.transform = "rotate(-45deg) translate(7px, -6px)"
      } else {
        span.style.transform = ""
        span.style.opacity = ""
      }
    })
  })

  // Menu navigation
  menuItems.forEach((item) => {
    item.addEventListener("click", function (e) {
      e.preventDefault()

      const targetSection = this.getAttribute("data-section")

      // Remove active class from all menu items and sections
      menuItems.forEach((menuItem) => menuItem.classList.remove("active"))
      contentSections.forEach((section) => section.classList.remove("active"))

      // Add active class to clicked menu item and corresponding section
      this.classList.add("active")
      document.getElementById(targetSection).classList.add("active")

      // Close sidebar on mobile after selection
      if (window.innerWidth <= 768) {
        sidebar.classList.remove("active")
        mainContent.classList.remove("sidebar-open")

        // Reset hamburger menu
        const spans = sidebarToggle.querySelectorAll("span")
        spans.forEach((span) => {
          span.style.transform = ""
          span.style.opacity = ""
        })
      }
    })
  })

  // Close sidebar when clicking outside on mobile
  document.addEventListener("click", (e) => {
    if (window.innerWidth <= 768) {
      if (!sidebar.contains(e.target) && !sidebarToggle.contains(e.target)) {
        sidebar.classList.remove("active")
        mainContent.classList.remove("sidebar-open")

        // Reset hamburger menu
        const spans = sidebarToggle.querySelectorAll("span")
        spans.forEach((span) => {
          span.style.transform = ""
          span.style.opacity = ""
        })
      }
    }
  })

  // Handle window resize
  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) {
      sidebar.classList.remove("active")
      mainContent.classList.remove("sidebar-open")

      // Reset hamburger menu
      const spans = sidebarToggle.querySelectorAll("span")
      spans.forEach((span) => {
        span.style.transform = ""
        span.style.opacity = ""
      })
    }
  })

  // Add smooth scrolling for better UX
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()
      const target = document.querySelector(this.getAttribute("href"))
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }
    })
  })

  // Add loading animation to buttons
  document.querySelectorAll(".btn-primary").forEach((button) => {
    button.addEventListener("click", function () {
      const originalText = this.textContent
      this.textContent = "Loading..."
      this.disabled = true

      // Simulate loading
      setTimeout(() => {
        this.textContent = originalText
        this.disabled = false
      }, 2000)
    })
  })

  // Add hover effects to stat cards
  document.querySelectorAll(".stat-card").forEach((card) => {
    card.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-5px) scale(1.02)"
    })

    card.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0) scale(1)"
    })
  })

  // Animate numbers on page load
  function animateNumbers() {
    const numbers = document.querySelectorAll(".stat-number")

    numbers.forEach((number) => {
      const finalValue = Number.parseInt(number.textContent.replace(/[^\d]/g, ""))
      const prefix = number.textContent.replace(/[\d,]/g, "")
      let currentValue = 0
      const increment = finalValue / 50

      const timer = setInterval(() => {
        currentValue += increment
        if (currentValue >= finalValue) {
          currentValue = finalValue
          clearInterval(timer)
        }

        if (prefix.includes("₹")) {
          number.textContent = "₹" + Math.floor(currentValue).toLocaleString()
        } else {
          number.textContent = Math.floor(currentValue).toString()
        }
      }, 30)
    })
  }

  // Run number animation on page load
  setTimeout(animateNumbers, 500)

  // Add search functionality
  const searchInput = document.querySelector(".search-box input")
  if (searchInput) {
    searchInput.addEventListener("input", function () {
      const searchTerm = this.value.toLowerCase()
      // Add search logic here
      console.log("Searching for:", searchTerm)
    })
  }

  // Add notification system
  function showNotification(message, type = "info") {
    const notification = document.createElement("div")
    notification.className = `notification ${type}`
    notification.textContent = message
    notification.style.cssText = `
            position: fixed;
            top: 90px;
            right: 20px;
            background: white;
            padding: 1rem 1.5rem;
            border-radius: 12px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.1);
            z-index: 1001;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `

    document.body.appendChild(notification)

    setTimeout(() => {
      notification.style.transform = "translateX(0)"
    }, 100)

    setTimeout(() => {
      notification.style.transform = "translateX(100%)"
      setTimeout(() => {
        document.body.removeChild(notification)
      }, 300)
    }, 3000)
  }

  // Add logout functionality
  document.querySelector(".menu-item.logout").addEventListener("click", (e) => {
    e.preventDefault()
    if (confirm("Are you sure you want to logout?")) {
      showNotification("Logging out...", "info")
      // Add logout logic here
    }
  })

  // Product category functionality with dynamic forms
  document.querySelectorAll(".add-product-btn").forEach((button) => {
    button.addEventListener("click", function () {
      const category = this.getAttribute("data-category")
      const categoryName = this.textContent.trim()

      // Show the form container
      const formContainer = document.getElementById("productFormContainer")
      const formTitle = document.getElementById("formTitle")
      const dynamicForm = document.getElementById("dynamicProductForm")

      // Update form title
      formTitle.textContent = `Add ${categoryName.replace("Add ", "")}`

      // Generate form content based on category
      dynamicForm.innerHTML = generateFormContent(category)

      // Show the form with animation
      formContainer.style.display = "block"
      formContainer.scrollIntoView({ behavior: "smooth", block: "start" })

      // Initialize form functionality
      initializeFormFeatures(category)

      // Show success notification
      showNotification(`${categoryName} form opened`, "success")
    })
  })

  // Close form functionality
  document.addEventListener("click", (e) => {
    if (e.target && e.target.id === "closeForm") {
      const formContainer = document.getElementById("productFormContainer")
      formContainer.style.display = "none"
    }
  })

  // Generate form content based on category
  function generateFormContent(category) {
    const forms = {
      phones: `
            <div class="form-grid">
                <div class="form-group">
                    <label class="form-label">Product Name</label>
                    <input type="text" class="form-input" placeholder="Enter phone name" required>
                </div>
                
                <div class="form-group">
                    <label class="form-label">RAM</label>
                    <select class="form-select" required>
                        <option value="">Select RAM</option>
                        <option value="2GB">2GB</option>
                        <option value="3GB">3GB</option>
                        <option value="4GB">4GB</option>
                        <option value="6GB">6GB</option>
                        <option value="8GB">8GB</option>
                        <option value="12GB">12GB</option>
                        <option value="16GB">16GB</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Storage (ROM)</label>
                    <select class="form-select" required>
                        <option value="">Select Storage</option>
                        <option value="32GB">32GB</option>
                        <option value="64GB">64GB</option>
                        <option value="128GB">128GB</option>
                        <option value="256GB">256GB</option>
                        <option value="512GB">512GB</option>
                        <option value="1TB">1TB</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Camera</label>
                    <input type="text" class="form-input" placeholder="e.g., 48MP + 12MP + 5MP" required>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Processor</label>
                    <input type="text" class="form-input" placeholder="e.g., Snapdragon 888" required>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Color</label>
                    <input type="text" class="form-input" placeholder="Available colors" required>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Battery</label>
                    <input type="text" class="form-input" placeholder="e.g., 4000mAh" required>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Display</label>
                    <input type="text" class="form-input" placeholder="e.g., 6.1 inch AMOLED" required>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Operating System</label>
                    <select class="form-select" required>
                        <option value="">Select OS</option>
                        <option value="Android 14">Android 14</option>
                        <option value="Android 13">Android 13</option>
                        <option value="Android 12">Android 12</option>
                        <option value="iOS 17">iOS 17</option>
                        <option value="iOS 16">iOS 16</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Price (₹)</label>
                    <input type="number" class="form-input" placeholder="Enter price" required>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Rating</label>
                    <div class="rating-container">
                        <div class="star-rating">
                            <span class="star" data-rating="1">★</span>
                            <span class="star" data-rating="2">★</span>
                            <span class="star" data-rating="3">★</span>
                            <span class="star" data-rating="4">★</span>
                            <span class="star" data-rating="5">★</span>
                        </div>
                        <span class="rating-text">0 stars</span>
                    </div>
                </div>
                
                <div class="form-group full-width">
                    <label class="form-label">Product Description</label>
                    <textarea class="form-textarea" placeholder="Enter product description" rows="4"></textarea>
                </div>
            </div>
            
            <div class="form-group">
                <label class="form-label">Main Product Image</label>
                <div class="image-upload-container" id="mainImageUpload">
                    <div class="upload-icon">📷</div>
                    <div class="upload-text">Click to upload main product image</div>
                    <div class="upload-subtext">PNG, JPG up to 5MB</div>
                    <input type="file" class="file-input" id="mainImageInput" accept="image/*">
                </div>
                <div id="mainImagePreview" class="image-preview-container"></div>
            </div>
            
            <div class="form-group">
                <label class="form-label">Additional Product Images</label>
                <div class="image-upload-container" id="additionalImagesUpload">
                    <div class="upload-icon">🖼️</div>
                    <div class="upload-text">Click to upload additional images</div>
                    <div class="upload-subtext">Multiple images allowed - PNG, JPG up to 5MB each</div>
                    <input type="file" class="file-input" id="additionalImagesInput" accept="image/*" multiple>
                </div>
                <div id="additionalImagesPreview" class="image-preview-container"></div>
            </div>
            
            <div class="form-actions">
                <button type="button" class="btn-secondary" id="closeForm">Cancel</button>
                <button type="submit" class="btn-submit">Add Phone</button>
            </div>
        `,
      // Placeholder for other categories - will be implemented when you provide the fields
      watches: `<div class="form-grid"><div class="form-group full-width"><p>Watch form will be implemented next...</p></div></div>`,
      earphones: `<div class="form-grid"><div class="form-group full-width"><p>Earphones form will be implemented next...</p></div></div>`,
      speakers: `<div class="form-grid"><div class="form-group full-width"><p>Speakers form will be implemented next...</p></div></div>`,
      accessories: `<div class="form-grid"><div class="form-group full-width"><p>Accessories form will be implemented next...</p></div></div>`,
    }

    return forms[category] || "<p>Form not available</p>"
  }

  // Initialize form features (star rating, image upload, etc.)
  function initializeFormFeatures(category) {
    // Star rating functionality
    const stars = document.querySelectorAll(".star")
    const ratingText = document.querySelector(".rating-text")
    let currentRating = 0

    stars.forEach((star) => {
      star.addEventListener("click", function () {
        currentRating = Number.parseInt(this.getAttribute("data-rating"))
        updateStarRating(currentRating)
        ratingText.textContent = `${currentRating} star${currentRating !== 1 ? "s" : ""}`
      })

      star.addEventListener("mouseenter", function () {
        const hoverRating = Number.parseInt(this.getAttribute("data-rating"))
        updateStarRating(hoverRating)
      })
    })

    document.querySelector(".star-rating").addEventListener("mouseleave", () => {
      updateStarRating(currentRating)
    })

    function updateStarRating(rating) {
      stars.forEach((star, index) => {
        if (index < rating) {
          star.classList.add("active")
        } else {
          star.classList.remove("active")
        }
      })
    }

    // Image upload functionality
    initializeImageUpload("mainImageUpload", "mainImageInput", "mainImagePreview", false)
    initializeImageUpload("additionalImagesUpload", "additionalImagesInput", "additionalImagesPreview", true)

    // Form submission
    document.getElementById("dynamicProductForm").addEventListener("submit", function (e) {
      e.preventDefault()

      // Show loading state
      const submitBtn = this.querySelector(".btn-submit")
      const originalText = submitBtn.textContent
      submitBtn.textContent = "Adding Product..."
      submitBtn.disabled = true

      // Simulate API call
      setTimeout(() => {
        submitBtn.textContent = originalText
        submitBtn.disabled = false
        showNotification("Product added successfully!", "success")

        // Reset form
        this.reset()
        currentRating = 0
        updateStarRating(0)
        ratingText.textContent = "0 stars"
        document.getElementById("mainImagePreview").innerHTML = ""
        document.getElementById("additionalImagesPreview").innerHTML = ""
      }, 2000)
    })
  }

  // Image upload functionality
  function initializeImageUpload(containerId, inputId, previewId, multiple) {
    const container = document.getElementById(containerId)
    const input = document.getElementById(inputId)
    const preview = document.getElementById(previewId)

    if (!container || !input || !preview) return

    container.addEventListener("click", () => input.click())

    container.addEventListener("dragover", (e) => {
      e.preventDefault()
      container.classList.add("dragover")
    })

    container.addEventListener("dragleave", () => {
      container.classList.remove("dragover")
    })

    container.addEventListener("drop", (e) => {
      e.preventDefault()
      container.classList.remove("dragover")
      const files = e.dataTransfer.files
      handleFiles(files, preview, multiple)
    })

    input.addEventListener("change", (e) => {
      handleFiles(e.target.files, preview, multiple)
    })
  }

  function handleFiles(files, preview, multiple) {
    if (!multiple) {
      preview.innerHTML = ""
    }

    Array.from(files).forEach((file) => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const imageDiv = document.createElement("div")
          imageDiv.className = "image-preview"
          imageDiv.innerHTML = `
                    <img src="${e.target.result}" alt="Preview">
                    <button type="button" class="remove-image" onclick="this.parentElement.remove()">×</button>
                `
          preview.appendChild(imageDiv)
        }
        reader.readAsDataURL(file)
      }
    })
  }

  // Add hover effect for product cards
  document.querySelectorAll(".product-category-card").forEach((card) => {
    card.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-8px) scale(1.02)"
    })

    card.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0) scale(1)"
    })
  })

  // Animate product stats on section load
  function animateProductStats() {
    const statValues = document.querySelectorAll(".products-stats .stat-value")

    statValues.forEach((stat) => {
      const finalValue = Number.parseInt(stat.textContent)
      let currentValue = 0
      const increment = finalValue / 30

      const timer = setInterval(() => {
        currentValue += increment
        if (currentValue >= finalValue) {
          currentValue = finalValue
          clearInterval(timer)
        }
        stat.textContent = Math.floor(currentValue)
      }, 50)
    })
  }

  // Trigger stats animation when products section becomes active
  const productsMenuItem = document.querySelector('[data-section="products"]')
  if (productsMenuItem) {
    productsMenuItem.addEventListener("click", () => {
      setTimeout(animateProductStats, 300)
    })
  }
})
