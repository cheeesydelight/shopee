document.addEventListener("DOMContentLoaded", () => {
  // Function to initialize animations
  function initializeAnimations() {
    // Fade-in animation for elements with the class 'fade-in'
    const fadeInElements = document.querySelectorAll(".fade-in")

    const fadeInOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.2, // Adjust threshold as needed
    }

    const fadeInObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active")
          fadeInObserver.unobserve(entry.target) // Stop observing after fade-in
        }
      })
    }, fadeInOptions)

    fadeInElements.forEach((element) => {
      fadeInObserver.observe(element)
    })

    // Slide-in animation for elements with the class 'slide-in'
    const slideInElements = document.querySelectorAll(".slide-in")

    const slideInOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.2, // Adjust threshold as needed
    }

    const slideInObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active")
          slideInObserver.unobserve(entry.target) // Stop observing after slide-in
        }
      })
    }, slideInOptions)

    slideInElements.forEach((element) => {
      slideInObserver.observe(element)
    })
  }
  //theme changer
  const themeToggle = document.getElementById('themeToggle');
  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-theme');
    themeToggle.textContent = document.body.classList.contains('light-theme') ? '☀️' : '🌙';
  });
  
  // Function to set up responsive behavior
  function setupResponsiveBehavior() {
    // Toggle mobile menu
    const burgerIcon = document.querySelector(".burger-icon")
    const mobileNav = document.querySelector(".mobile-nav")

    if (burgerIcon && mobileNav) {
      burgerIcon.addEventListener("click", () => {
        mobileNav.classList.toggle("active")
      })
    }

    // Close mobile menu when a link is clicked
    const mobileLinks = document.querySelectorAll(".mobile-nav a")
    mobileLinks.forEach((link) => {
      link.addEventListener("click", () => {
        mobileNav.classList.remove("active")
      })
    })

    // Sticky header
    const header = document.querySelector("header")
    const heroSection = document.querySelector(".hero")

    if (header && heroSection) {
      const heroHeight = heroSection.offsetHeight

      function handleScroll() {
        if (window.scrollY > heroHeight) {
          header.classList.add("sticky")
        } else {
          header.classList.remove("sticky")
        }
      }

      window.addEventListener("scroll", handleScroll)
    }
  }

  // Function to add event listeners
  function addEventListeners() {
    // Example: Add a scroll event listener
    window.addEventListener("scroll", () => {
      // Your scroll-related logic here
    })

    // Example: Add a click event listener
    document.addEventListener("click", (event) => {
      // Your click-related logic here
    })
  }

  // Add video functionality to the initialization
  function initializeApp() {
    addEventListeners()
    initializeAnimations()
    setupResponsiveBehavior()
    initializeVideoPlayer() // Add this line
  }

  // Add this new function for video player functionality
  function initializeVideoPlayer() {
    const video = document.getElementById("heroVideo")
    const playPauseBtn = document.getElementById("playPauseBtn")
    const muteBtn = document.getElementById("muteBtn")

    if (!video || !playPauseBtn || !muteBtn) return

    const playIcon = playPauseBtn.querySelector(".play-icon")
    const pauseIcon = playPauseBtn.querySelector(".pause-icon")
    const volumeIcon = muteBtn.querySelector(".volume-icon")
    const muteIcon = muteBtn.querySelector(".mute-icon")

    // Video event listeners
    video.addEventListener("loadstart", () => {
      video.parentElement.classList.add("video-loading")
    })

    video.addEventListener("canplay", () => {
      video.parentElement.classList.remove("video-loading")
    })

    video.addEventListener("play", () => {
      playIcon.style.display = "none"
      pauseIcon.style.display = "block"
    })

    video.addEventListener("pause", () => {
      playIcon.style.display = "block"
      pauseIcon.style.display = "none"
    })

    video.addEventListener("volumechange", () => {
      if (video.muted) {
        volumeIcon.style.display = "none"
        muteIcon.style.display = "block"
      } else {
        volumeIcon.style.display = "block"
        muteIcon.style.display = "none"
      }
    })

    // Play/Pause button functionality
    playPauseBtn.addEventListener("click", () => {
      if (video.paused) {
        video.play().catch((e) => {
          console.log("Video play failed:", e)
        })
      } else {
        video.pause()
      }
    })

    // Mute/Unmute button functionality
    muteBtn.addEventListener("click", () => {
      video.muted = !video.muted
    })

    // Click on video to play/pause
    video.addEventListener("click", () => {
      if (video.paused) {
        video.play().catch((e) => {
          console.log("Video play failed:", e)
        })
      } else {
        video.pause()
      }
    })

    // Handle autoplay policy restrictions
    video.addEventListener("loadedmetadata", () => {
      // Try to play the video
      const playPromise = video.play()

      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.log("Autoplay prevented:", error)
          // Show play button if autoplay fails
          playIcon.style.display = "block"
          pauseIcon.style.display = "none"
        })
      }
    })

    // Intersection Observer for video performance
    const videoObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Video is visible, ensure it's playing if it should be
            if (!video.paused && video.currentTime > 0) {
              video.play().catch((e) => console.log("Video play failed:", e))
            }
          } else {
            // Video is not visible, pause to save resources
            if (!video.paused) {
              video.pause()
            }
          }
        })
      },
      { threshold: 0.5 },
    )

    videoObserver.observe(video)

    // Keyboard controls
    document.addEventListener("keydown", (e) => {
      if (e.target.tagName.toLowerCase() === "input") return

      switch (e.code) {
        case "Space":
          e.preventDefault()
          if (video.paused) {
            video.play().catch((e) => console.log("Video play failed:", e))
          } else {
            video.pause()
          }
          break
        case "KeyM":
          e.preventDefault()
          video.muted = !video.muted
          break
      }
    })

    // Add video analytics (optional)
    let videoStarted = false
    video.addEventListener("play", () => {
      if (!videoStarted) {
        console.log("Hero video started playing")
        videoStarted = true
      }
    })

    video.addEventListener("ended", () => {
      console.log("Hero video ended")
    })
  }

  // Initialize the application
  initializeApp()
})

const slider = document.querySelector('.slider');
const nextBtn = document.querySelector('.next-btn');
const prevBtn = document.querySelector('.prev-btn');

let currentSlide = 0;
const totalSlides = slider.children.length;
const slidesPerView = 5;

function updateSlider() {
  const slideWidth = slider.querySelector('.slide').offsetWidth + 20; // +gap
  const moveX = slideWidth * currentSlide;
  slider.style.transform = `translateX(-${moveX}px)`;
}

nextBtn.addEventListener('click', () => {
  if (currentSlide < totalSlides - slidesPerView) {
    currentSlide++;
    updateSlider();
  }
});

prevBtn.addEventListener('click', () => {
  if (currentSlide > 0) {
    currentSlide--;
    updateSlider();
  }
});

// Auto-scroll every 3 seconds
setInterval(() => {
  if (currentSlide < totalSlides - slidesPerView) {
    currentSlide++;
  } else {
    currentSlide = 0;
  }
  updateSlider();
}, 3000);

