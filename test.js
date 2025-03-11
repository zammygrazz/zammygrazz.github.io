

document.addEventListener('DOMContentLoaded', () => {
    let container = document.getElementById('product1');
    let closeCart = document.querySelector('.close');
    let products = document.getElementsByClassName('pro');
    let listCartHTML = document.querySelector('.listCart');
    let iconCart = document.querySelector('.icon-cart');
    let body = document.querySelector('body');
    let listProduct = [];
    let carts = [];



    iconCart.addEventListener('click', () => {
        body.classList.toggle('showCart');
    });

    closeCart.addEventListener('click', () => {
        body.classList.toggle('showCart');
    });

    const addDataHTML = () => {
        container.innerHTML = `
                <h2>Featured Products</h2>
                <p>Summer Collection New Modern Design</p>
                <div class="pro-container"></div>
            `;

        let proContainer = container.querySelector('.pro-container');

        if (listProduct.length > 0) {
            listProduct.forEach(element => {
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
                            <a href="" class="addCart" data-id="${element.id}"> <i class="fal fa-shopping-cart cart"></i></a>
                        </div>
                    `;
                proContainer.innerHTML += productHTML;


            });
        }

    }


    container.addEventListener('click', (event) => {
        let positionClick = event.target;

        // Check if the clicked element is an addCart button
        if (positionClick.classList.contains("addCart")) {
            let productId = positionClick.dataset.id; // Access data-id directly from the button
            console.log("The productID is ", productId);
            addToCart(productId);
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
                        <div class="totalPrice">ksh. ${totalPrice}</div>
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

        iconCart.innerHTML = totalQuantity;
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
            addDataHTML();


            for (let i = 0; i < products.length; i++) {
                products[i].addEventListener('click', (event) => {
                    let positionofClick = event.target;

                    // Check if the clicked element is an image inside the '.pro' class
                    if (positionofClick.tagName.toLowerCase() === 'img') {
                        let imgSrc = positionofClick.src;  // Get the image source
                        console.log("set image is:", imgSrc);  // Log or store the image source
                        let relativeImgSrc = imgSrc.replace('http://127.0.0.1:5500/', '');
                        console.log("relative image source is:", relativeImgSrc);
                        // Store in a variable or do something with the image source
                        // For example, store it in localStorage
                        localStorage.setItem("selectedImage", relativeImgSrc);

                        // Check if there is a selected image after data is loaded
                        let selectedImage = localStorage.getItem("selectedImage");
                        console.log("get image is ", selectedImage)
                        if (selectedImage) {
                            let selectedProduct = listProduct.find(product => product.img === selectedImage);
                            if (selectedProduct) {
                                let imgArray = selectedProduct.subCategory || [];

                                console.log("Image array is:", JSON.stringify(imgArray));
                                localStorage.setItem('storedArray', JSON.stringify(imgArray));
                                window.location.href = "sproduct.html";
                            } else {
                                console.log('error trying to store array imgArray');
                            }
                        }


                    } else {
                        console.log('no matches found');
                    }
                });
            }




        } catch (error) {
            console.log(error);
        }
    }


    initApp();
});
