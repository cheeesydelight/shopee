
  const hotDealItems = document.querySelectorAll('.hot-deals-item');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // Animate only once
      }
    });
  }, {
    threshold: 1
  });

  hotDealItems.forEach(item => {
    observer.observe(item);
  });

