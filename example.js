

document.addEventListener('DOMContentLoaded', () => {


    let container = document.getElementById('product1');
    let closeCart = document.querySelector('.close');
    let products = document.getElementsByClassName('pro');
    let listCartHTML = document.querySelector('.listCart');
    let iconCart = document.querySelector('.icon-cart');
    let span = document.querySelector('.span');
    let body = document.querySelector('body');
    let sideBar = document.getElementById('mobile');
    let nav = document.getElementById('navbar');
    let cancel = document.getElementById('cancel');
    const subtotalElement = document.getElementById('cartSubtotal');
    const totalElement = document.getElementById('cartTotal');
    let listProduct = [];
    let carts = [];
    let sproduct = JSON.parse(localStorage.getItem('sproduct')) || [];


    const productsPerPage = 8;
    let currentPage = 1;



    sideBar.addEventListener('click', () => {
        nav.classList.toggle('active');
    });

    cancel.addEventListener('click', (e) => {
        e.preventDefault();
        nav.classList.toggle('active');
    });

    iconCart.addEventListener('click', () => {
        body.classList.toggle('showCart');
    });

    closeCart.addEventListener('click', () => {
        body.classList.toggle('showCart');
    });

    const addDataHTML = (page) => {
        const start = (page - 1) * productsPerPage;
        const end = start + productsPerPage;
        const paginatedProducts = listProduct.slice(start, end);

        container.innerHTML = `
                <h2>Featured Products</h2>
                <p>Summer Collection New Modern Design</p>
                <div class="pro-container"></div>
            `;

        let proContainer = container.querySelector('.pro-container');


        if (paginatedProducts.length > 0) {
            paginatedProducts.forEach(element => {
                let productHTML = `
                        <div class="pro" data-id="${element.id}">
                            <img src="${element.img}" alt="">
                            <div class="des">
                                <span>${element.brand}</span>
                                <h5>${element.description}</h5>
                                <div class="star">
                                    <li class="fas fa-star"></li>
                                    <li class="fas fa-star"></li>
                                    <li class="fas fa-star"></li>
                                    <li class="fas fa-star"></li>
                                    <li class="fas fa-star"></li>
                                </div>
                                <h4>${element.price}</h4>
                            </div>
                            <a href="#"> <i class="fal fa-shopping-cart cart" data-id="${element.id}"></i></a>
                        </div>
                    `;
                proContainer.innerHTML += productHTML;


            });
        }

    }

    //pagination 

    function setupPagination() {
        const totalPages = Math.ceil(listProduct.length / productsPerPage);
        const pagination = document.getElementById("pagination");
        pagination.innerHTML = ""; // clear old links

        for (let i = 1; i <= totalPages; i++) {
            const link = document.createElement("a");
            link.href = "#";
            link.textContent = i;

            if (i === currentPage) {
                link.classList.add("active"); // for styling the current page
            }

            link.addEventListener("click", (e) => {
                e.preventDefault(); // prevent page jump
                currentPage = i;
                addDataHTML(currentPage);
                setupPagination(); // re-render with new active link
            });

            pagination.appendChild(link);
        }

        // Optional: Add a next arrow
        if (currentPage < totalPages) {
            const nextLink = document.createElement("a");
            nextLink.href = "#";
            nextLink.innerHTML = `<i class="fal fa-long-arrow-alt-right"></i>`;

            nextLink.addEventListener("click", (e) => {
                e.preventDefault();
                currentPage++;
                addDataHTML(currentPage);
                setupPagination();
            });

            pagination.appendChild(nextLink);
        }
    }



    document.addEventListener('click', (event) => {
        let positionClick = event.target;
        console.log("Clicked element:", positionClick);

        // If the clicked element is the cart button, stop redirection
        if (positionClick.classList.contains('cart')) {

            event.preventDefault();
            body.classList.toggle('showCart');
            let productId = positionClick.dataset.id;
            console.log("Adding to cart, product ID:", productId);
            addToCart(productId, size = "M");
            return; // Exit function to prevent redirection
        }

        // Find the closest `.pro` element (product container)
        let productElement = positionClick.closest('.pro');

        if (productElement) {
            let imgSrc = productElement.querySelector('img').src;
            console.log("Product image source:", imgSrc);

            let relativeImgSrc = imgSrc.replace(window.location.origin + '/', '');
            console.log("Relative image source:", relativeImgSrc);

            localStorage.setItem("selectedImage", relativeImgSrc);

            // Find product details using the stored image
            let selectedProduct = listProduct.find(product => product.img === relativeImgSrc);
            if (selectedProduct) {
                let imgArray = selectedProduct.subCategory || [];
                localStorage.setItem('sproduct', JSON.stringify(selectedProduct));
                localStorage.setItem('storedArray', JSON.stringify(imgArray));

                window.location.href = "sproduct.html";
            } else {
                console.log("Error: Product not found.");
            }
        }

        if (positionClick.id === 'addToCartBtn') {
            const selectedSize = document.getElementById('productSize').value;
            const quantity = parseInt(document.getElementById('productQty').value);
            //const product = JSON.parse(localStorage.getItem('sproduct'));

            if (!sproduct || !sproduct.id) {
                alert("Product data missing.");
                return;
            }


            if (selectedSize === "Select Size") {
                alert("Please select a size.");
                return;
            }

            if (quantity <= 0) {
                alert("Quantity must be at least 1.");
                return;
            }

            const uniqueCartId = `${sproduct.id}_${selectedSize}`;
            carts = JSON.parse(localStorage.getItem("cart")) || [];

            const existingIndex = carts.findIndex(item => item.cartId === uniqueCartId);
            if (existingIndex >= 0) {
                carts[existingIndex].quantity += quantity;
                carts[existingIndex].size = selectedSize;
            } else {
                carts.push({
                    cartId: uniqueCartId, // ✅ Unique by ID + size
                    productId: sproduct.id, // store separately for lookup
                    quantity: quantity,
                    size: selectedSize
                });
            }

            body.classList.toggle('showCart');
            localStorage.setItem("cart", JSON.stringify(carts));

            addCartToHTML();

            alert("Product added to cart!");

        }




    });



    const addToCart = (productId, size = "M") => {

        const cartId = `${productId}_${size}`;

        let positionThisProductInCart = carts.findIndex((value) => value.cartId === cartId);

        if (positionThisProductInCart < 0) {
            carts.push({
                cartId: cartId,
                productId: productId,  // Store the base product ID separately
                size: size,
                quantity: 1
            });
        } else {
            carts[positionThisProductInCart].quantity = carts[positionThisProductInCart].quantity + 1;
        }
        addCartToMemory();
        addCartToHTML();

    }



    const addCartToMemory = () => {
        localStorage.setItem('cart', JSON.stringify(carts));
    }


    const addCartToHTML = () => {
        listCartHTML.innerHTML = '';
        let totalQuantity = 0;
        let grandTotal = 0;



        if (carts.length > 0) {
            carts.forEach((x) => {
                totalQuantity += x.quantity;
                let elementIndex = listProduct.findIndex((value) => value.id == x.productId);
                if (elementIndex >= 0) {
                    let info = listProduct[elementIndex];
                    let newCart = document.createElement('div');
                    newCart.classList.add('item');
                    newCart.dataset.id = x.cartId;
                    let totalPrice = Number(info.price) * x.quantity;
                    grandTotal += totalPrice;

                    newCart.innerHTML = `
                        <img src="${info.img}" alt="">
                        <div class="size">
                            <select class="size-select" data-id="${x.cartId}">
                                <option value="S" ${x.size === "S" ? "selected" : ""}>S</option>
                                <option value="M" ${x.size === "M" ? "selected" : ""}>M</option>
                                <option value="L" ${x.size === "L" ? "selected" : ""}>L</option>
                                <option value="XL" ${x.size === "XL" ? "selected" : ""}>XL</option>
                                <option value="2XL" ${x.size === "2XL" ? "selected" : ""}>2XL</option>
                            </select>
                        </div>
                        <div class="totalPrice">ksh. ${totalPrice}</div>
                        <div class="quantity">
                            <span class="minus">-</span>
                            <span>${x.quantity}</span>
                            <span class="plus">+</span>
                        </div>
                    `;

                    listCartHTML.appendChild(newCart);
                }
            });
        }

        span.innerHTML = totalQuantity;
        subtotalElement.textContent = `Ksh. ${grandTotal}`;
        totalElement.textContent = `Ksh. ${grandTotal}`;
    };


    listCartHTML.addEventListener('change', (event) => {
        if (event.target.classList.contains('size-select')) {
            const productId = event.target.dataset.id;
            const selectedSize = event.target.value;
            const cartItem = carts.find(item => item.cartId === productId);
            if (cartItem) {
                cartItem.size = selectedSize;
                addCartToMemory();
            }
        }
    });


    listCartHTML.addEventListener('click', (event) => {
        let positionClick = event.target;
        if (positionClick.classList.contains('minus') || positionClick.classList.contains('plus')) {
            let productID = positionClick.closest('.item').dataset.id;

            if (positionClick.classList.contains('plus')) {
                updateQuantity(productID, 1);
            } else if (positionClick.classList.contains('minus')) {
                updateQuantity(productID, -1);
            }
        }
    });

    const updateQuantity = (productID, change) => {
        let cartItem = carts.findIndex(item => item.cartId == productID);
        if (cartItem >= 0) {
            carts[cartItem].quantity += change;

            //remove item if quantity is less than 0
            if (carts[cartItem].quantity <= 0) {
                carts.splice(cartItem, 1);
            }

            addCartToMemory();
            addCartToHTML();

        }
    }



    async function initApp() {
        try {
            let response = await fetch('test.json');
            if (!response.ok) {
                console.error("Network response not okay");
                return;
            }
            const data = await response.json();
            listProduct = data;

            localStorage.setItem('allProducts', JSON.stringify(listProduct));
            addDataHTML(currentPage);
            setupPagination();

            let storedCart = localStorage.getItem('cart');
            if (storedCart) {
                carts = JSON.parse(storedCart); // Restore cart items
                addCartToHTML();
            }



        } catch (error) {
            console.log(error);
        }
    }


    initApp();
});
