document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const container = document.getElementById('product1');
    const proContainer = document.querySelector('.pro-container');
    const closeCart = document.querySelector('.close');
    const iconCart = document.querySelector('.icon-cart');
    const span = document.querySelector('.span');
    const body = document.querySelector('body');
    const sideBar = document.getElementById('mobile');
    const nav = document.getElementById('navbar');
    const cancel = document.getElementById('cancel');
    const listCartHTML = document.querySelector('.listCart');
    const subtotalElement = document.getElementById('cartSubtotal');
    const totalElement = document.getElementById('cartTotal');
    const sortSelect = document.getElementById('sort-select');

    // Data
    let listProduct = [];
    let carts = JSON.parse(localStorage.getItem('cart')) || [];
    let sproduct = JSON.parse(localStorage.getItem('sproduct')) || [];

    // Pagination
    const productsPerPage = 8;
    let currentPage = 1;
    let filteredProducts = [];

    // Initialize the app
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
            const category = localStorage.getItem('selectedCategory');
            if (category) {
                filterProductsByCategory(category);
                localStorage.removeItem('selectedCategory');
            } else {
                filteredProducts = [...listProduct];
                addDataHTML(currentPage);
            }

            setupPagination();
            addCartToHTML();

            // Initialize sort if available
            if (sortSelect) {
                sortSelect.addEventListener('change', handleSortChange);
            }

        } catch (error) {
            console.error('Error loading products:', error);
            showErrorState();
        }
    }

    // Event Listeners
    sideBar.addEventListener('click', () => nav.classList.toggle('active'));
    cancel.addEventListener('click', (e) => {
        e.preventDefault();
        nav.classList.toggle('active');
    });
    iconCart.addEventListener('click', () => body.classList.toggle('showCart'));
    closeCart.addEventListener('click', () => body.classList.toggle('showCart'));

    // Product Display Functions
    function addDataHTML(page) {
        const start = (page - 1) * productsPerPage;
        const end = start + productsPerPage;
        const paginatedProducts = filteredProducts.slice(start, end);

        if (!container.querySelector('.pro-container')) {
            container.innerHTML = `
                <h2>Featured Products</h2>
                <p>Summer Collection New Modern Design</p>
                <div class="pro-container"></div>
            `;
        }

        const proContainer = container.querySelector('.pro-container');
        proContainer.innerHTML = '';

        if (paginatedProducts.length === 0) {
            proContainer.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-box-open"></i>
                    <h3>No products found</h3>
                    <p>Try adjusting your filters</p>
                </div>
            `;
            return;
        }

        paginatedProducts.forEach(product => {
            const productHTML = `
                <div class="pro" data-id="${product.id}">
                    <img src="${product.img}" alt="${product.description}">
                    <div class="des">
                        <span>${product.brand}</span>
                        <h5>${product.description}</h5>
                        <div class="star">
                            ${'<i class="fas fa-star"></i>'.repeat(5)}
                        </div>
                        <h4>Ksh. ${product.price.toLocaleString()}</h4>
                    </div>
                    <a href="#"><i class="fal fa-shopping-cart cart" data-id="${product.id}"></i></a>
                </div>
            `;
            proContainer.innerHTML += productHTML;
        });
    }

    // Pagination
    function setupPagination() {
        const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
        const pagination = document.getElementById("pagination");
        if (!pagination) return;

        pagination.innerHTML = '';

        for (let i = 1; i <= totalPages; i++) {
            const link = document.createElement("a");
            link.href = "#";
            link.textContent = i;
            link.classList.toggle("active", i === currentPage);

            link.addEventListener("click", (e) => {
                e.preventDefault();
                currentPage = i;
                addDataHTML(currentPage);
                setupPagination();
                window.scrollTo({ top: container.offsetTop, behavior: 'smooth' });
            });

            pagination.appendChild(link);
        }

        if (currentPage < totalPages) {
            const nextLink = document.createElement("a");
            nextLink.href = "#";
            nextLink.innerHTML = `<i class="fal fa-long-arrow-alt-right"></i>`;

            nextLink.addEventListener("click", (e) => {
                e.preventDefault();
                currentPage++;
                addDataHTML(currentPage);
                setupPagination();
                window.scrollTo({ top: container.offsetTop, behavior: 'smooth' });
            });

            pagination.appendChild(nextLink);
        }
    }

    // Category Filtering
    function filterProductsByCategory(category) {
        filteredProducts = listProduct.filter(product => {
            if (category === 'male') return product.gender === 'Male';
            if (category === 'female') return product.gender === 'Female';
            if (category === 'kids') return product.category === 'Kids';
            return true;
        });

        currentPage = 1;
        addDataHTML(currentPage);
        setupPagination();
        updateActiveCategory(category);
    }

    function updateActiveCategory(category) {
        document.querySelectorAll('#chategory a').forEach(link => {
            link.classList.toggle('active', link.dataset.category === category);
        });
    }

    // Sorting
    function handleSortChange() {
        const sortValue = sortSelect.value;

        filteredProducts.sort((a, b) => {
            switch (sortValue) {
                case 'price-asc': return a.price - b.price;
                case 'price-desc': return b.price - a.price;
                case 'name-asc': return a.description.localeCompare(b.description);
                default: return 0;
            }
        });

        currentPage = 1;
        addDataHTML(currentPage);
        setupPagination();
    }

    // Cart Functions
    function addToCart(productId, size = "M") {
        const cartId = `${productId}_${size}`;
        let positionThisProductInCart = carts.findIndex((value) => value.cartId === cartId);

        if (positionThisProductInCart < 0) {
            carts.push({
                cartId: cartId,
                productId: productId,
                size: size,
                quantity: 1
            });
        } else {
            carts[positionThisProductInCart].quantity += 1;
        }

        showCartNotification();
        addCartToMemory();
        addCartToHTML();
    }

    function addCartToMemory() {
        localStorage.setItem('cart', JSON.stringify(carts));
        // notify other scripts in this page
        window.dispatchEvent(new CustomEvent('cartUpdated', { detail: carts }));
    }

    // Listen for cart changes from other scripts (e.g. final.js, cart1.js)
    window.addEventListener('cartUpdated', (e) => {
        carts = e?.detail || JSON.parse(localStorage.getItem('cart')) || [];
        addCartToHTML();
    });

    function addCartToHTML() {
        listCartHTML.innerHTML = '';
        let totalQuantity = 0;
        let grandTotal = 0;

        if (carts.length > 0) {
            carts.forEach((cartItem) => {
                totalQuantity += cartItem.quantity;
                const product = listProduct.find(p => p.id == cartItem.productId);

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
                }
            });
        } else {
            listCartHTML.innerHTML = '<div class="empty-cart">Your cart is empty</div>';
        }

        span.textContent = totalQuantity;
        if (subtotalElement) subtotalElement.textContent = `Ksh. ${grandTotal.toLocaleString()}`;
        if (totalElement) totalElement.textContent = `Ksh. ${grandTotal.toLocaleString()}`;
    }

    // UI Feedback
    function showCartNotification() {
        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>Item added to cart!</span>
        `;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => notification.remove(), 500);
        }, 2000);
    }

    function showErrorState() {
        proContainer.innerHTML = `
            <div class="error-state">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>Failed to load products</h3>
                <p>Please try again later</p>
                <button onclick="window.location.reload()">Retry</button>
            </div>
        `;
    }

    // Event Delegation
    document.addEventListener('click', (event) => {
        const target = event.target;

        // Add to cart button
        if (target.classList.contains('cart')) {
            event.preventDefault();
            const productId = target.dataset.id;
            addToCart(productId);
            return;
        }

        // Product click (for details page)
        const productElement = target.closest('.pro');
        if (productElement) {
            const imgSrc = productElement.querySelector('img').src;
            const relativeImgSrc = imgSrc.replace(window.location.origin + '/', '');
            localStorage.setItem("selectedImage", relativeImgSrc);

            const selectedProduct = listProduct.find(product => product.img === relativeImgSrc);
            if (selectedProduct) {
                // const subImages = selectedProduct.subCategory;

                // localStorage.setItem('storedArray', JSON.stringify(subImages));
                // console.log('the subImages are ', subImages);

                localStorage.setItem('sproduct', JSON.stringify(selectedProduct));

                window.location.href = "sproduct.html";
            }
        }

        // Cart quantity controls
        if (target.classList.contains('plus') || target.classList.contains('minus')) {
            const productID = target.closest('.item').dataset.id;
            updateQuantity(productID, target.classList.contains('plus') ? 1 : -1);
        }
    });

    listCartHTML.addEventListener('change', (event) => {
        if (event.target.classList.contains('size-select')) {
            const productId = event.target.dataset.id;
            const selectedSize = event.target.value;
            const cartItem = carts.find(item => item.cartId === productId);

            if (cartItem) {
                cartItem.size = selectedSize;
                cartItem.cartId = `${cartItem.productId}_${selectedSize}`;
                addCartToMemory();
                addCartToHTML();
            }
        }
    });

    // Helper Functions
    function updateQuantity(productID, change) {
        const cartItemIndex = carts.findIndex(item => item.cartId == productID);

        if (cartItemIndex >= 0) {
            carts[cartItemIndex].quantity += change;

            if (carts[cartItemIndex].quantity <= 0) {
                carts.splice(cartItemIndex, 1);
            }

            addCartToMemory();
            addCartToHTML();
        }
    }

    // Category click handlers
    document.querySelectorAll('#chategory a').forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const category = this.dataset.category;
            localStorage.setItem('selectedCategory', category);
            window.location.href = this.href;
        });
    });

    // Initialize the app
    initApp();
});