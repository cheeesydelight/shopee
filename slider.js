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
    this.isPlaying = true
    this.isHovered = false
    this.autoPlayInterval = null
    this.totalSlides = this.slides.length

    // Touch handling
    this.touchStartX = 0
    this.touchEndX = 0
    this.minSwipeDistance = 50

    this.init()
  }

  init() {
    this.createDots()
    this.updateDisplay()
    this.bindEvents()
    this.updateTotalSlides()
    this.startAutoPlay()
  }

  createDots() {
    this.dotsContainer.innerHTML = ""
    for (let i = 0; i < this.totalSlides; i++) {
      const dot = document.createElement("button")
      dot.className = "dot"
      dot.setAttribute("aria-label", `Go to slide ${i + 1}`)
      dot.addEventListener("click", () => this.goToSlide(i))
      this.dotsContainer.appendChild(dot)
    }
  }

  bindEvents() {
    // Navigation buttons
    this.prevBtn.addEventListener("click", () => this.prevSlide())
    this.nextBtn.addEventListener("click", () => this.nextSlide())

    // Play/Pause button
    this.playPauseBtn.addEventListener("click", () => this.togglePlayPause())

    // Hover events - only affect auto-play, don't change slides
    const sliderContainer = document.querySelector(".slider-container")
    sliderContainer.addEventListener("mouseenter", () => {
      this.isHovered = true
    })

    sliderContainer.addEventListener("mouseleave", () => {
      this.isHovered = false
    })

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
      this.nextSlide()
    } else if (isRightSwipe) {
      this.prevSlide()
    }

    this.touchStartX = 0
    this.touchEndX = 0
  }

  handleKeyDown(e) {
    switch (e.key) {
      case "ArrowLeft":
        e.preventDefault()
        this.prevSlide()
        break
      case "ArrowRight":
        e.preventDefault()
        this.nextSlide()
        break
      case " ":
        e.preventDefault()
        this.togglePlayPause()
        break
    }
  }

  nextSlide() {
    this.currentIndex = (this.currentIndex + 1) % this.totalSlides
    this.updateDisplay()
    this.resetAutoPlay()
  }

  prevSlide() {
    this.currentIndex = (this.currentIndex - 1 + this.totalSlides) % this.totalSlides
    this.updateDisplay()
    this.resetAutoPlay()
  }

  goToSlide(index) {
    if (index >= 0 && index < this.totalSlides) {
      this.currentIndex = index
      this.updateDisplay()
      this.resetAutoPlay()
    }
  }

  updateDisplay() {
    // Update slider position
    const translateX = -(this.currentIndex * 100)
    this.slider.style.transform = `translateX(${translateX}%)`

    // Update dots
    document.querySelectorAll(".dot").forEach((dot, index) => {
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

  startAutoPlay() {
    // Clear any existing interval
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval)
    }

    // Only start if playing
    if (this.isPlaying) {
      this.autoPlayInterval = setInterval(() => {
        // Only advance if not hovered
        if (!this.isHovered) {
          this.nextSlide()
        }
      }, 5000)
    }
  }

  resetAutoPlay() {
    // Only reset if currently playing
    if (this.isPlaying) {
      this.startAutoPlay()
    }
  }

  stopAutoPlay() {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval)
      this.autoPlayInterval = null
    }
  }

  togglePlayPause() {
    this.isPlaying = !this.isPlaying

    const pauseIcon = this.playPauseBtn.querySelector(".pause-icon")
    const playIcon = this.playPauseBtn.querySelector(".play-icon")

    if (this.isPlaying) {
      pauseIcon.style.display = "inline"
      playIcon.style.display = "none"
      this.playPauseBtn.setAttribute("aria-label", "Pause slideshow")
      this.startAutoPlay()
    } else {
      pauseIcon.style.display = "none"
      playIcon.style.display = "inline"
      this.playPauseBtn.setAttribute("aria-label", "Play slideshow")
      this.stopAutoPlay()
    }
  }
}

// Initialize slider when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new InteractiveSlider()
})

// Add parallax effect for background circles
document.addEventListener("DOMContentLoaded", () => {
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

  // Add loading animation to images
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
