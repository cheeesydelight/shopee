class InteractiveSlider {
  constructor() {
    this.slider = document.getElementById("slider")
    this.slides = document.querySelectorAll(".slide")
    this.prevBtn = document.getElementById("prevBtn")
    this.nextBtn = document.getElementById("nextBtn")
    this.playPauseBtn = document.getElementById("playPauseBtn")
    this.dotsContainer = document.getElementById("dotsContainer")
    this.progressBar = document.getElementById("progressBar")
    this.currentSlideSpan = document.getElementById("currentSlide")
    this.totalSlidesSpan = document.getElementById("totalSlides")

    this.currentIndex = 0
    this.totalSlides = this.slides.length
    this.dots = []

    // Touch handling
    this.touchStartX = 0
    this.touchEndX = 0
    this.minSwipeDistance = 50

    // Auto-slide cleanup (just in case)
    this.autoSlideInterval = null
    this.stopAutoSlide()

    this.init()
  }

  stopAutoSlide() {
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval)
      this.autoSlideInterval = null
    }
  }

  init() {
    console.log("Slider initialized") // For debug, remove later
    this.createDots()
    this.updateDisplay()
    this.bindEvents()
    this.updateTotalSlides()
  }

  createDots() {
    this.dotsContainer.innerHTML = ""
    this.dots = []

    for (let i = 0; i < this.totalSlides; i++) {
      const dot = document.createElement("button")
      dot.className = "dot"
      dot.setAttribute("aria-label", `Go to slide ${i + 1}`)
      dot.addEventListener("click", () => {
        this.currentIndex = i
        this.updateDisplay()
      })
      this.dotsContainer.appendChild(dot)
      this.dots.push(dot)
    }
  }

  bindEvents() {
    // Navigation buttons
    this.prevBtn.addEventListener("click", () => {
      this.currentIndex = (this.currentIndex - 1 + this.totalSlides) % this.totalSlides
      this.updateDisplay()
    })

    this.nextBtn.addEventListener("click", () => {
      this.currentIndex = (this.currentIndex + 1) % this.totalSlides
      this.updateDisplay()
    })

    // Hide play/pause button completely
    this.playPauseBtn.style.display = "none"

    // Touch events
    this.slider.addEventListener("touchstart", (e) => this.handleTouchStart(e), { passive: true })
    this.slider.addEventListener("touchmove", (e) => this.handleTouchMove(e), { passive: true })
    this.slider.addEventListener("touchend", () => this.handleTouchEnd(), { passive: true })

    // Keyboard navigation
    document.addEventListener("keydown", (e) => this.handleKeyDown(e))
  }

  handleTouchStart(e) {
    this.touchStartX = e.touches[0].clientX
  }

  handleTouchMove(e) {
    this.touchEndX = e.touches[0].clientX
  }

  handleTouchEnd() {
    if (!this.touchStartX || !this.touchEndX) return

    const distance = this.touchStartX - this.touchEndX
    const isLeftSwipe = distance > this.minSwipeDistance
    const isRightSwipe = distance < -this.minSwipeDistance

    if (isLeftSwipe) {
      this.currentIndex = (this.currentIndex + 1) % this.totalSlides
      this.updateDisplay()
    } else if (isRightSwipe) {
      this.currentIndex = (this.currentIndex - 1 + this.totalSlides) % this.totalSlides
      this.updateDisplay()
    }

    this.touchStartX = 0
    this.touchEndX = 0
  }

  handleKeyDown(e) {
    switch (e.key) {
      case "ArrowLeft":
        e.preventDefault()
        this.currentIndex = (this.currentIndex - 1 + this.totalSlides) % this.totalSlides
        this.updateDisplay()
        break
      case "ArrowRight":
        e.preventDefault()
        this.currentIndex = (this.currentIndex + 1) % this.totalSlides
        this.updateDisplay()
        break
    }
  }

  updateDisplay() {
    this.currentIndex = Math.max(0, Math.min(this.currentIndex, this.totalSlides - 1))
    const translateX = -(this.currentIndex * 100)
    this.slider.style.transform = `translateX(${translateX}%)`

    // Update dots
    this.dots.forEach((dot, index) => {
      dot.classList.toggle("active", index === this.currentIndex)
    })

    // Update progress bar
    const progress = ((this.currentIndex + 1) / this.totalSlides) * 100
    this.progressBar.style.setProperty("--progress", `${progress}%`)

    // Update current slide number
    this.currentSlideSpan.textContent = this.currentIndex + 1
  }

  updateTotalSlides() {
    this.totalSlidesSpan.textContent = this.totalSlides
  }
}

// Prevent accidental multiple initializations globally
if (!window.sliderInitialized) {
  document.addEventListener("DOMContentLoaded", () => {
    new InteractiveSlider()
    window.sliderInitialized = true
  })
}

// Parallax + Image Load Animation
document.addEventListener("DOMContentLoaded", () => {
  // Parallax
  document.addEventListener("mousemove", (e) => {
    const circles = document.querySelectorAll(".bg-circle")
    const x = e.clientX / window.innerWidth
    const y = e.clientY / window.innerHeight

    circles.forEach((circle, index) => {
      const speed = (index + 1) * 0.3
      const xPos = (x - 0.5) * speed * 30
      const yPos = (y - 0.5) * speed * 30
      circle.style.transform = `translate(${xPos}px, ${yPos}px)`
    })
  })

  // Image load animation
  document.querySelectorAll(".slide img").forEach((img) => {
    img.addEventListener("load", function () {
      this.style.opacity = "0"
      this.style.transform = "scale(1.1)"
      setTimeout(() => {
        this.style.transition = "opacity 0.5s ease, transform 0.5s ease"
        this.style.opacity = "1"
        this.style.transform = "scale(1)"
      }, 100)
    })
  })
})
