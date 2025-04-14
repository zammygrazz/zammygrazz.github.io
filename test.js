

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
    let listProduct = [];
    let carts = [];

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


    // container.addEventListener('click', (event) => {

    //     let positionClick = event.target;
    //     console.log("the position of the click is ", positionClick);
    //     // Check if the clicked element is an addCart button
    //     if (positionClick.tagName.toLowerCase() === 'i') {
    //         event.preventDefault();
    //         let productId = positionClick.dataset.id; // Access data-id directly from the button
    //         console.log("The productID is ", productId);
    //         addToCart(productId);
    //     } else if (positionClick.tagName.toLowerCase() === 'img') {

    //         let imgSrc = positionClick.src;  // Get the image source
    //         console.log("set image is:", imgSrc);  // Log or store the image source
    //         let relativeImgSrc = imgSrc.replace('http://127.0.0.1:5500/', '');
    //         console.log("relative image source is:", relativeImgSrc);
    //         // Store in a variable or do something with the image source
    //         // For example, store it in localStorage
    //         localStorage.setItem("selectedImage", relativeImgSrc);

    //         // Check if there is a selected image after data is loaded
    //         let selectedImage = localStorage.getItem("selectedImage");
    //         console.log("get image is ", selectedImage)
    //         if (selectedImage) {
    //             let selectedProduct = listProduct.find(product => product.img === selectedImage);
    //             if (selectedProduct) {
    //                 let imgArray = selectedProduct.subCategory || [];

    //                 console.log("Image array is:", JSON.stringify(imgArray));
    //                 localStorage.setItem('storedArray', JSON.stringify(imgArray));
    //                 window.location.href = "sproduct.html";
    //             } else {
    //                 console.log('error trying to store array imgArray');
    //             }
    //         }

    //     }
    // });

    container.addEventListener('click', (event) => {
        let positionClick = event.target;
        console.log("Clicked element:", positionClick);

        // If the clicked element is the cart button, stop redirection
        if (positionClick.classList.contains('cart')) {
            event.preventDefault();
            let productId = positionClick.dataset.id;
            console.log("Adding to cart, product ID:", productId);
            addToCart(productId);
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
                console.log("Redirecting to sproduct.html...");
                window.location.href = "sproduct.html";
            } else {
                console.log("Error: Product not found.");
            }
        }
    });



    const addToCart = (productId) => {
        let positionThisProductInCart = carts.findIndex((value) => value.cartId === productId);
        if (carts.length <= 0) {
            carts = [{
                cartId: productId,
                quantity: 1
            }];
        } else if (positionThisProductInCart < 0) {
            carts.push({
                cartId: productId,
                quantity: 1
            });
        } else {
            carts[positionThisProductInCart].quantity = carts[positionThisProductInCart].quantity + 1;
        }

        console.log(carts);

        addCartToMemory();
        addCartToHTML();

    }



    const addCartToMemory = () => {
        localStorage.setItem('cart', JSON.stringify(carts));
    }

    const addCartToHTML = () => {
        listCartHTML.innerHTML = '';
        let totalQuantity = 0;

        if (carts.length > 0) {
            carts.forEach((x) => {
                totalQuantity = totalQuantity + x.quantity;
                let elementIndex = listProduct.findIndex((value) => value.id == x.cartId);
                if (elementIndex >= 0) {
                    let info = listProduct[elementIndex];
                    let newCart = document.createElement('div');
                    newCart.classList.add('item');
                    newCart.dataset.id = x.cartId;
                    let totalPrice = info.price * x.quantity;


                    newCart.innerHTML = `
                        <img src="${info.img}" alt="">
                        <div class="name">${info.brand}</div>
                        <div class="totalPrice">ksh. ${info.price}</div>
                        <div class="quantity">
                            <span class="minus">
                                -</span>
                            <span>${x.quantity}</span>
                            <span class="plus">+</span>
                        </div>
                        `;

                    listCartHTML.appendChild(newCart);
                }

            });
        }

        span.innerHTML = totalQuantity;
    }


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
            console.log("Loaded JSON data:", data);
            listProduct = data;
            addDataHTML(currentPage);
            setupPagination();

            let storedCart = localStorage.getItem('cart');
            if (storedCart) {
                carts = JSON.parse(storedCart); // Restore cart items
            }

            addCartToHTML();

        } catch (error) {
            console.log(error);
        }
    }


    initApp();
});
