document.addEventListener('DOMContentLoaded', function () {
    // Get all elements with the class 'add-cart'
    var addToCartButtons = document.querySelectorAll('.add-cart');

    // Add click event listener to each 'Add to Cart' button
    addToCartButtons.forEach(function (button) {
        button.addEventListener('click', function () {
            // Get the parent product element
            var productElement = button.closest('.mix.new-arrivals');

            // Get product details
            var productName = productElement.querySelector('.product__item__text h6').innerText;
            var productPrice = productElement.querySelector('.product__item__text h5').innerText;

            // Display a notification
            alert('Product added to cart: ' + productName + ' - ' + productPrice);

            // Store product information in local storage
            var cart = JSON.parse(localStorage.getItem('cart')) || [];
            cart.push({ name: productName, price: productPrice });
            localStorage.setItem('cart', JSON.stringify(cart));
        });
    });
});