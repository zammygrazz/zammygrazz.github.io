document.addEventListener('DOMContentLoaded', () => {

    let nav = document.getElementById('navbar');
    let iconCart = document.querySelector('.icon-cart span');
    let closeCart = document.querySelector('.close');
    let body = document.querySelector('body');
    let listProductHTML = document.querySelector('.listProduct');
    let listCartHTML = document.querySelector('.listCart');
    let bar = document.getElementById('bar');
    let cancel = document.getElementById('cancel');
    let mainImg = document.getElementById('mainImg');
    let smallImg = document.getElementsByClassName('small-img');


    smallImg[0].onclick = () => {
        mainImg.src = smallImg[0].src;
    }

    smallImg[1].onclick = () => {
        mainImg.src = smallImg[1].src;
    }

    smallImg[2].onclick = () => {
        mainImg.src = smallImg[2].src;
    }

    smallImg[3].onclick = () => {
        mainImg.src = smallImg[3].src;
    }

    let listProduct = [];
    let carts = [];

    bar.addEventListener('click', () => {
        nav.classList.toggle('active');
    });

    cancel.addEventListener('click', () => {
        nav.classList.remove('active');
    });

    iconCart.addEventListener('click', () => {
        body.classList.toggle('showCart');
    });

    closeCart.addEventListener('click', () => {
        body.classList.toggle('showCart');
    });

    const addDataHTML = () => {
        listProductHTML.innerHTML = "";
        if (listProduct.length > 0) {
            listProduct.forEach((product) => {
                let newProduct = document.createElement("div");
                newProduct.classList.add("item");
                newProduct.dataset.id = product.id;
                newProduct.innerHTML = `
                    <img src="${product.image}" alt="">
                    <h2>${product.name}</h2>
                    <div class="price">ksh ${product.price}</div>
                    <button class="addCart">
                    Add to Cart
                    </button>
                `;

                listProductHTML.appendChild(newProduct);


            });


        }

    }


    listProductHTML.addEventListener('click', (event) => {
        let positionClick = event.target;

        if (positionClick.classList.contains("addCart")) {
            let productId = positionClick.parentElement.dataset.id;
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


        addCartToHTML();
        addCartToMemory();
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
                        <img src="${info.image}" alt="">
                        <div class="name">${info.name}</div>
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

            let myPromise = await fetch('product.json');


            if (!myPromise.ok) {
                console.error("network response not okay");
                return;
            }
            const data = await myPromise.json();
            listProduct = data;
            addDataHTML();

            //  get cart from memory

            if (localStorage.getItem('cart')) {
                carts = JSON.parse(localStorage.getItem('cart'));
                addCartToHTML();
            }



        } catch (error) {
            console.log(error);

        }






    }



    initApp();

});

