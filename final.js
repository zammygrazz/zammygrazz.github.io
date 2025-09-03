// final.js - Product Detail Page Specific JavaScript
document.addEventListener('DOMContentLoaded', function () {
    // DOM Elements for product detail page
    const addToCartBtn = document.getElementById('addToCartBtn');
    const productSizeSelect = document.getElementById('productSize');
    const productQtyInput = document.getElementById('productQty');
    const mainImage = document.getElementById('mainImg');
    const smallImages = document.querySelectorAll('.small-img');
    const listCartHTML = document.querySelector('.listCart');
    let carts = JSON.parse(localStorage.getItem('cart')) || [];

    // Load product data from localStorage
    const sproduct = JSON.parse(localStorage.getItem('sproduct')) || {};
    const storedArray = JSON.parse(localStorage.getItem('storedArray')) || [];
    const selectedImage = localStorage.getItem('selectedImage');

    const subtotalElement = document.getElementById('cartSubtotal');
    const totalElement = document.getElementById('cartTotal');
    const sortSelect = document.getElementById('sort-select');
    const span = document.querySelector('.span');

    // Data
    let listProduct = [];

    // Initialize product detail page
    initProductDetailPage();

     async function initApp() {
        try {
            // Show loading state
            proContainer.innerHTML = '<div class="loading-spinner"></div>';

            // Load products
            const response = await fetch('test.json');
            if (!response.ok) throw new Error('Network response was not ok');

            listProduct = await response.json();
            localStorage.setItem('allProducts', JSON.stringify(listProduct));

            // Check for category filter
            // const category = localStorage.getItem('selectedCategory');
            // if (category) {
            //     filterProductsByCategory(category);
            //     localStorage.removeItem('selectedCategory');
            // } else {
            //     filteredProducts = [...listProduct];
            //     addDataHTML(currentPage);
            // }

            //setupPagination();
            //addCartToHTML();

            // Initialize sort if available
            if (sortSelect) {
                sortSelect.addEventListener('change', handleSortChange);
            }

        } catch (error) {
            console.error('Error loading products:', error);
            //showErrorState();
        }
    }

    // Event Listeners
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', handleAddToCart);
    }

    // Small image click handlers
    smallImages.forEach(img => {
        img.addEventListener('click', function () {
            mainImage.src = this.src;

            // Update active thumbnail
            smallImages.forEach(smallImg => smallImg.classList.remove('active-thumbnail'));
            this.classList.add('active-thumbnail');
        });
    });

    // Initialize first thumbnail as active
    if (smallImages.length > 0) {
        smallImages[0].classList.add('active-thumbnail');
    }

    function initProductDetailPage() {
        // Update product details if data exists
        if (sproduct && Object.keys(sproduct).length > 0) {
            updateProductDetails(sproduct);
        }

        // Update main image if selected image exists
        if (selectedImage) {
            mainImage.src = selectedImage;
        }

        // Update small images gallery if array exists
        if (storedArray.length > 0) {
            updateImageGallery(storedArray);
        }
    }

    function updateProductDetails(product) {
        // Update product title
        const productTitle = document.querySelector('.single-pro-details h4');
        if (productTitle && product.description) {
            productTitle.textContent = product.description;
        }

        // Update product price
        const productPrice = document.querySelector('.single-pro-details h2');
        if (productPrice && product.price) {
            productPrice.textContent = `Ksh. ${product.price.toLocaleString()}`;
        }

        // Update product brand/category
        const productCategory = document.querySelector('.single-pro-details h6');
        if (productCategory && product.brand) {
            productCategory.textContent = `Home / ${product.brand}`;
        }
    }

    function updateImageGallery(imagesArray) {
        const smallImgGroup = document.querySelector('.small-img-group');
        if (smallImgGroup && imagesArray.length > 0) {
            smallImgGroup.innerHTML = '';

            imagesArray.forEach((imgSrc, index) => {
                const smallImgCol = document.createElement('div');
                smallImgCol.className = 'small-img-col';

                const smallImg = document.createElement('img');
                smallImg.src = imgSrc;
                smallImg.alt = `Product view ${index + 1}`;
                smallImg.width = '100%';
                smallImg.className = 'small-img';

                smallImg.addEventListener('click', function () {
                    mainImage.src = this.src;

                    // Update active thumbnail
                    document.querySelectorAll('.small-img').forEach(img => {
                        img.classList.remove('active-thumbnail');
                    });
                    this.classList.add('active-thumbnail');
                });

                smallImgCol.appendChild(smallImg);
                smallImgGroup.appendChild(smallImgCol);
            });

            // Set first image as active
            const firstSmallImg = smallImgGroup.querySelector('.small-img');
            if (firstSmallImg) {
                firstSmallImg.classList.add('active-thumbnail');
            }
        }
    }

    function handleAddToCart() {
        const selectedSize = productSizeSelect.value;
        const quantity = parseInt(productQtyInput.value);

        // Validation
        if (selectedSize === "Select Size") {
            alert("Please select a size.");
            productSizeSelect.focus();
            return;
        }

        if (quantity <= 0 || isNaN(quantity)) {
            alert("Please enter a valid quantity.");
            productQtyInput.focus();
            return;
        }

        if (!sproduct || !sproduct.id) {
            alert("Product information is missing. Please try again.");
            return;
        }

        // Add to cart logic
        const uniqueCartId = `${sproduct.id}_${selectedSize}`;
        let carts = JSON.parse(localStorage.getItem("cart")) || [];

        const existingIndex = carts.findIndex(item => item.cartId === uniqueCartId);

        if (existingIndex >= 0) {
            // Update existing item
            carts[existingIndex].quantity += quantity;
            carts[existingIndex].size = selectedSize;
        } else {
            // Add new item
            carts.push({
                cartId: uniqueCartId,
                productId: sproduct.id,
                name: sproduct.description,
                price: sproduct.price,
                img: sproduct.img || selectedImage,
                quantity: quantity,
                size: selectedSize
            });
        }

        // Save to localStorage
        localStorage.setItem("cart", JSON.stringify(carts));

        addCartToHTML2();

        // Show success message
        showAddToCartSuccess();

        // Update cart count
        updateCartCount();
    }

    function addCartToHTML2() {
        listCartHTML.innerHTML = '';
        let totalQuantity = 0;
        let grandTotal = 0;

        console.log("cart output from add to", carts);

        if (carts.length > 0) {

            console.log('dsiusd')

            carts.forEach((cartItem) => {
                totalQuantity += cartItem.quantity;
                const product = listProduct.find(p => p.id == cartItem.productId);

                console.log('sdjgdsoidsf')
                console.log(product)

                if (product) {
                    const totalPrice = Number(product.price) * cartItem.quantity;
                    grandTotal += totalPrice;

                    const cartItemHTML = `
                        <div class="item" data-id="${cartItem.cartId}">
                            <img src="${product.img}" alt="${product.description}">
                            <div class="size">
                                <select class="size-select" data-id="${cartItem.cartId}">
                                    <option value="S" ${cartItem.size === "S" ? "selected" : ""}>S</option>
                                    <option value="M" ${cartItem.size === "M" ? "selected" : ""}>M</option>
                                    <option value="L" ${cartItem.size === "L" ? "selected" : ""}>L</option>
                                    <option value="XL" ${cartItem.size === "XL" ? "selected" : ""}>XL</option>
                                    <option value="XXL" ${cartItem.size === "XXL" ? "selected" : ""}>2XL</option>
                                </select>
                            </div>
                            <div class="totalPrice">Ksh. ${totalPrice.toLocaleString()}</div>
                            <div class="quantity">
                                <span class="minus">-</span>
                                <span>${cartItem.quantity}</span>
                                <span class="plus">+</span>
                            </div>
                        </div>
                    `;
                    listCartHTML.innerHTML += cartItemHTML;
                    console.log('dskjdsoihfdsgojhfdkfdkfk')
                }
            });
        } else {
            listCartHTML.innerHTML = '<div class="empty-cart">Your cart is empty</div>';
        }

        span.textContent = totalQuantity;
        if (subtotalElement) subtotalElement.textContent = `Ksh. ${grandTotal.toLocaleString()}`;
        if (totalElement) totalElement.textContent = `Ksh. ${grandTotal.toLocaleString()}`;
    }



    function showAddToCartSuccess() {
        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>Product added to cart successfully!</span>
        `;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => notification.remove(), 500);
        }, 2000);
    }

    function updateCartCount() {
        const carts = JSON.parse(localStorage.getItem("cart")) || [];
        const totalQuantity = carts.reduce((total, item) => total + item.quantity, 0);

        // Update cart count in header
        const cartSpan = document.querySelector('.icon-cart .span');
        if (cartSpan) {
            cartSpan.textContent = totalQuantity;
        }
    }

    // Initialize cart count on page load
    updateCartCount();
});