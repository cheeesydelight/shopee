const params = new URLSearchParams(window.location.search);
  const productId = params.get("id");

  fetch('/product.json')
    .then(response => response.json())
    .then(products => {
      const product = products.find(item => item.id == productId);
      if (product) {
        document.getElementById('product-image').src = product.image;
        document.getElementById('product-title').textContent = product.title;
        document.getElementById('product-rating').textContent = product.rating;
        document.getElementById('product-badge').textContent = product.badge;
        document.getElementById('product-price').textContent = product.price;
        document.getElementById('product-mrp').textContent = product.mrp;
        document.getElementById('product-discount').textContent = product.discount;
        document.getElementById('product-description').textContent = product.description;

        // Load specs if available
        const specsList = document.getElementById('product-details');
        if (product.details) {
          product.details.forEach(spec => {
            const li = document.createElement('li');
            li.textContent = spec;
            specsList.appendChild(li);
          });
        }
      } else {
        document.querySelector('.product-info').innerHTML = '<p>Product not found.</p>';
      }
    });
  
