document.addEventListener('DOMContentLoaded', function () {

  // Function to initialize animations
  function initializeAnimations() {
    const fadeInElements = document.querySelectorAll(".fade-in");
    const fadeInObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
          fadeInObserver.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      rootMargin: "0px",
      threshold: 0.2,
    });
    fadeInElements.forEach((element) => fadeInObserver.observe(element));

    const slideInElements = document.querySelectorAll(".slide-in");
    const slideInObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
          slideInObserver.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      rootMargin: "0px",
      threshold: 0.2,
    });
    slideInElements.forEach((element) => slideInObserver.observe(element));
  }

  // Theme changer
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      document.body.classList.toggle('light-theme');
      themeToggle.textContent = document.body.classList.contains('light-theme') ? '☀️' : '🌙';
    });
  }

  // Responsive behavior
  function setupResponsiveBehavior() {
    const burgerIcon = document.querySelector(".burger-icon");
    const mobileNav = document.querySelector(".mobile-nav");
    if (burgerIcon && mobileNav) {
      burgerIcon.addEventListener("click", () => {
        mobileNav.classList.toggle("active");
      });

      const mobileLinks = document.querySelectorAll(".mobile-nav a");
      mobileLinks.forEach((link) => {
        link.addEventListener("click", () => {
          mobileNav.classList.remove("active");
        });
      });
    }

    const header = document.querySelector("header");
    const heroSection = document.querySelector(".hero");
    if (header && heroSection) {
      const heroHeight = heroSection.offsetHeight;
      function handleScroll() {
        if (window.scrollY > heroHeight) {
          header.classList.add("sticky");
        } else {
          header.classList.remove("sticky");
        }
      }
      window.addEventListener("scroll", handleScroll);
    }
  }

  function addEventListeners() {
    window.addEventListener("scroll", () => {});
    document.addEventListener("click", (event) => {});
  }

  function initializeVideoPlayer() {
    const video = document.getElementById("heroVideo");
    const playPauseBtn = document.getElementById("playPauseBtn");
    const muteBtn = document.getElementById("muteBtn");

    if (!video || !playPauseBtn || !muteBtn) return;

    const playIcon = playPauseBtn.querySelector(".play-icon");
    const pauseIcon = playPauseBtn.querySelector(".pause-icon");
    const volumeIcon = muteBtn.querySelector(".volume-icon");
    const muteIcon = muteBtn.querySelector(".mute-icon");

    video.addEventListener("loadstart", () => {
      video.parentElement.classList.add("video-loading");
    });

    video.addEventListener("canplay", () => {
      video.parentElement.classList.remove("video-loading");
    });

    video.addEventListener("play", () => {
      playIcon.style.display = "none";
      pauseIcon.style.display = "block";
    });

    video.addEventListener("pause", () => {
      playIcon.style.display = "block";
      pauseIcon.style.display = "none";
    });

    video.addEventListener("volumechange", () => {
      if (video.muted) {
        volumeIcon.style.display = "none";
        muteIcon.style.display = "block";
      } else {
        volumeIcon.style.display = "block";
        muteIcon.style.display = "none";
      }
    });

    playPauseBtn.addEventListener("click", () => {
      if (video.paused) {
        video.play().catch((e) => console.log("Video play failed:", e));
      } else {
        video.pause();
      }
    });

    muteBtn.addEventListener("click", () => {
      video.muted = !video.muted;
    });

    video.addEventListener("click", () => {
      if (video.paused) {
        video.play().catch((e) => console.log("Video play failed:", e));
      } else {
        video.pause();
      }
    });

    video.addEventListener("loadedmetadata", () => {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.log("Autoplay prevented:", error);
          playIcon.style.display = "block";
          pauseIcon.style.display = "none";
        });
      }
    });

    const videoObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (!video.paused && video.currentTime > 0) {
            video.play().catch((e) => console.log("Video play failed:", e));
          }
        } else {
          if (!video.paused) {
            video.pause();
          }
        }
      });
    }, { threshold: 0.5 });

    videoObserver.observe(video);

    document.addEventListener("keydown", (e) => {
      if (e.target.tagName.toLowerCase() === "input") return;

      switch (e.code) {
        case "Space":
          e.preventDefault();
          if (video.paused) {
            video.play().catch((e) => console.log("Video play failed:", e));
          } else {
            video.pause();
          }
          break;
        case "KeyM":
          e.preventDefault();
          video.muted = !video.muted;
          break;
      }
    });

    let videoStarted = false;
    video.addEventListener("play", () => {
      if (!videoStarted) {
        console.log("Hero video started playing");
        videoStarted = true;
      }
    });

    video.addEventListener("ended", () => {
      console.log("Hero video ended");
    });
  }

  function initializeApp() {
    addEventListeners();
    initializeAnimations();
    setupResponsiveBehavior();
    initializeVideoPlayer();
  }

  // Call main app initializer
  initializeApp();

  // ✅ SLIDER CODE MOVED INSIDE DOMContentLoaded
  const slider = document.querySelector('.slider');
  const nextBtn = document.querySelector('.next-btn');
  const prevBtn = document.querySelector('.prev-btn');

  if (slider && nextBtn && prevBtn) {
    let currentSlide = 0;
    const totalSlides = slider.children.length;
    const slidesPerView = 5;

    function updateSlider() {
      const slideWidth = slider.querySelector('.slide').offsetWidth + 20;
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

    setInterval(() => {
      if (currentSlide < totalSlides - slidesPerView) {
        currentSlide++;
      } else {
        currentSlide = 0;
      }
      updateSlider();
    }, 3000);
  }

}); // ✅ final closing bracket
