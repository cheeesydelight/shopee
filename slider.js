class ProductSlider {
  constructor() {
      this.currentSlide = 0;
      this.slides = document.querySelectorAll('.slide');
      this.dots = document.querySelectorAll('.dot');
      this.totalSlides = this.slides.length;
      this.isAutoPlaying = true;
      this.autoPlayInterval = null;
      this.autoPlayDelay = 4000;
      
      this.init();
  }
  
  init() {
      this.bindEvents();
      this.startAutoPlay();
      this.preloadImages();
  }
  
  bindEvents() {
      // Navigation buttons
      document.getElementById('prevBtn').addEventListener('click', () => {
          this.previousSlide();
      });
      
      document.getElementById('nextBtn').addEventListener('click', () => {
          this.nextSlide();
      });
      
      // Dots navigation
      this.dots.forEach((dot, index) => {
          dot.addEventListener('click', () => {
              this.goToSlide(index);
          });
      });
      
      // Auto-play toggle
      document.getElementById('autoplayBtn').addEventListener('click', () => {
          this.toggleAutoPlay();
      });
      
      // Keyboard navigation
      document.addEventListener('keydown', (e) => {
          if (e.key === 'ArrowLeft') {
              this.previousSlide();
          } else if (e.key === 'ArrowRight') {
              this.nextSlide();
          } else if (e.key === ' ') {
              e.preventDefault();
              this.toggleAutoPlay();
          }
      });
      
      // Touch/Swipe support
      this.addTouchSupport();
      
      // Pause on hover
      const sliderWrapper = document.querySelector('.slider-wrapper');
      sliderWrapper.addEventListener('mouseenter', () => {
          this.pauseAutoPlay();
      });
      
      sliderWrapper.addEventListener('mouseleave', () => {
          if (this.isAutoPlaying) {
              this.startAutoPlay();
          }
      });
      
      // Add to cart button animations
      this.addButtonAnimations();
      
      // Visibility change handling
      document.addEventListener('visibilitychange', () => {
          if (document.hidden) {
              this.pauseAutoPlay();
          } else if (this.isAutoPlaying) {
              this.startAutoPlay();
          }
      });
  }
  
  showSlide(index) {
      // Remove active classes
      this.slides.forEach((slide, i) => {
          slide.classList.remove('active', 'prev');
          if (i === this.currentSlide && i !== index) {
              slide.classList.add('prev');
          }
      });
      
      this.dots.forEach(dot => {
          dot.classList.remove('active');
      });
      
      // Add active classes
      this.slides[index].classList.add('active');
      this.dots[index].classList.add('active');
      
      this.currentSlide = index;
      
      // Trigger animation effects
      this.triggerSlideEffects(index);
  }
  
  nextSlide() {
      const nextIndex = (this.currentSlide + 1) % this.totalSlides;
      this.showSlide(nextIndex);
      this.resetAutoPlay();
  }
  
  previousSlide() {
      const prevIndex = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
      this.showSlide(prevIndex);
      this.resetAutoPlay();
  }
  
  goToSlide(index) {
      if (index !== this.currentSlide) {
          this.showSlide(index);
          this.resetAutoPlay();
      }
  }
  
  startAutoPlay() {
      if (this.autoPlayInterval) {
          clearInterval(this.autoPlayInterval);
      }
      
      this.autoPlayInterval = setInterval(() => {
          this.nextSlide();
      }, this.autoPlayDelay);
  }
  
  pauseAutoPlay() {
      if (this.autoPlayInterval) {
          clearInterval(this.autoPlayInterval);
          this.autoPlayInterval = null;
      }
  }
  
  resetAutoPlay() {
      if (this.isAutoPlaying) {
          this.pauseAutoPlay();
          this.startAutoPlay();
      }
  }
  
  toggleAutoPlay() {
      const btn = document.getElementById('autoplayBtn');
      
      if (this.isAutoPlaying) {
          this.isAutoPlaying = false;
          this.pauseAutoPlay();
          btn.textContent = 'Resume Auto-play';
          btn.style.background = 'rgba(59, 130, 246, 0.1)';
      } else {
          this.isAutoPlaying = true;
          this.startAutoPlay();
          btn.textContent = 'Pause Auto-play';
          btn.style.background = 'rgba(59, 130, 246, 0.2)';
      }
  }
  
  addTouchSupport() {
      let startX = 0;
      let endX = 0;
      let startY = 0;
      let endY = 0;
      
      const sliderWrapper = document.querySelector('.slider-wrapper');
      
      sliderWrapper.addEventListener('touchstart', (e) => {
          startX = e.changedTouches[0].screenX;
          startY = e.changedTouches[0].screenY;
      }, { passive: true });
      
      sliderWrapper.addEventListener('touchend', (e) => {
          endX = e.changedTouches[0].screenX;
          endY = e.changedTouches[0].screenY;
          this.handleSwipe();
      }, { passive: true });
      
      const handleSwipe = () => {
          const threshold = 50;
          const diffX = startX - endX;
          const diffY = Math.abs(startY - endY);
          
          // Only handle horizontal swipes
          if (Math.abs(diffX) > threshold && diffY < 100) {
              if (diffX > 0) {
                  this.nextSlide();
              } else {
                  this.previousSlide();
              }
          }
      };
      
      this.handleSwipe = handleSwipe;
  }
  
  addButtonAnimations() {
      const buttons = document.querySelectorAll('.add-to-cart');
      
      buttons.forEach(button => {
          button.addEventListener('click', function(e) {
              // Create ripple effect
              const ripple = document.createElement('span');
              const rect = this.getBoundingClientRect();
              const size = Math.max(rect.width, rect.height);
              const x = e.clientX - rect.left - size / 2;
              const y = e.clientY - rect.top - size / 2;
              
              ripple.style.cssText = `
                  position: absolute;
                  width: ${size}px;
                  height: ${size}px;
                  left: ${x}px;
                  top: ${y}px;
                  background: rgba(255, 255, 255, 0.3);
                  border-radius: 50%;
                  transform: scale(0);
                  animation: ripple 0.6s linear;
                  pointer-events: none;
              `;
              
              this.appendChild(ripple);
              
              setTimeout(() => {
                  ripple.remove();
              }, 600);
              
              // Button feedback
              this.style.transform = 'translateY(-1px) scale(0.98)';
              setTimeout(() => {
                  this.style.transform = '';
              }, 150);
              
              // Simulate add to cart action
              this.textContent = 'Added!';
              this.style.background = 'linear-gradient(45deg, #10b981, #059669)';
              
              setTimeout(() => {
                  this.textContent = 'Add to Cart';
                  this.style.background = 'linear-gradient(45deg, #3b82f6, #06b6d4)';
              }, 2000);
          });
      });
      
      // Add ripple animation CSS
      const style = document.createElement('style');
      style.textContent = `
          @keyframes ripple {
              to {
                  transform: scale(4);
                  opacity: 0;
              }
          }
      `;
      document.head.appendChild(style);
  }
  
  triggerSlideEffects(index) {
      const currentSlide = this.slides[index];
      const productCard = currentSlide.querySelector('.product-card');
      const imageContainer = currentSlide.querySelector('.image-container');
      const features = currentSlide.querySelectorAll('.feature');
      
      // Reset animations
      productCard.style.animation = 'none';
      imageContainer.style.animation = 'none';
      
      // Trigger entrance animations
      setTimeout(() => {
          productCard.style.animation = 'slideInUp 0.6s ease-out';
          imageContainer.style.animation = 'zoomIn 0.8s ease-out 0.2s both';
          
          features.forEach((feature, i) => {
              feature.style.animation = `fadeInUp 0.4s ease-out ${0.4 + i * 0.1}s both`;
          });
      }, 50);
  }
  
  preloadImages() {
      const images = document.querySelectorAll('.slide img');
      images.forEach(img => {
          const imageUrl = img.src;
          const preloadImg = new Image();
          preloadImg.src = imageUrl;
      });
  }
}

// Additional animations CSS
const additionalStyles = document.createElement('style');
additionalStyles.textContent = `
  @keyframes slideInUp {
      from {
          transform: translateY(30px);
          opacity: 0;
      }
      to {
          transform: translateY(0);
          opacity: 1;
      }
  }
  
  @keyframes zoomIn {
      from {
          transform: scale(0.8);
          opacity: 0;
      }
      to {
          transform: scale(1);
          opacity: 1;
      }
  }
  
  @keyframes fadeInUp {
      from {
          transform: translateY(20px);
          opacity: 0;
      }
      to {
          transform: translateY(0);
          opacity: 1;
      }
  }
`;
document.head.appendChild(additionalStyles);

// Initialize slider when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new ProductSlider();
});

// Handle window resize
window.addEventListener('resize', () => {
  // Recalculate dimensions if needed
  const sliderWrapper = document.querySelector('.slider-wrapper');
  if (sliderWrapper) {
      // Force reflow to handle responsive changes
      sliderWrapper.style.display = 'none';
      sliderWrapper.offsetHeight; // Trigger reflow
      sliderWrapper.style.display = '';
  }
});