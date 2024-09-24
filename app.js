document.addEventListener('DOMContentLoaded', () => {
    let iconCart = document.querySelector('.icon-cart');
    let closeCart = document.querySelector('.close');
    let body = document.querySelector('body');
    let listProductHTML = document.querySelector('.listProduct');
    let listCartHTML = document.querySelector('.listCart');
    let IconCartSpan = document.querySelector('.icon-cart span');

    let listProduct = [];
    let carts = [];

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

    // addDataHTML();


    listProductHTML.addEventListener('click', (event) => {
        let positionClick = event.target;

        if (positionClick.classList.contains("addCart")) {
            let productId = positionClick.parentElement.dataset.id;
            addToCart(productId);
        }
    });


    const addToCart = (product_id) => {
        let cartIndex = carts.findIndex((value) => value.cart_id == product_id);
        if (carts.length <= 0) {
            carts = [{
                cart_id: product_id,
                quantity: 1
            }];
        } else if (cartIndex < 0) {
            carts.push({
                cart_id: product_id,
                quantity: 1
            });
        } else {
            carts[cartIndex].quantity = carts[cartIndex].quantity + 1;
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
        carts.forEach(cart => {
            totalQuantity = totalQuantity + cart.quantity;
            let y = listProduct.find(q => q.id == cart.cart_id);
            if (y) {
                let newDiv = document.createElement('div');
                newDiv.classList.add('item');

                newDiv.innerHTML = `
                                <img src="${y.image}" alt="">
                                <div class="${y.name}">Name</div>
                                <div class="totalPrice">ksh.${y.price * cart.quantity}</div>
                                <div class="quantity">
                                    <span class="minus">
                                        -</span>
                                    <span>${cart.quantity}</span>
                                    <span class="plus">+</span>
                                </div> `;

                listCartHTML.appendChild(newDiv);

            }
        });

        IconCartSpan.innerText = totalQuantity;


    }

    listCartHTML.addEventListener('click', (event) => {
        let positionClick = event.target;
        if (positionClick.classList.contains('minus')) {
            carts.forEach(cart => {
                
                cart.quantity--;
            });
        }
        addCartToHTML();

    });


    async function initApp() {

        try {

            let myPromise = await fetch('product.json');


            if (!myPromise.ok) {
                console.error("network response not okay");
                return;
            }
            const data = await myPromise.json();
            listProduct = data;
            console.log(listProduct);
            addDataHTML();

            //get cart from memory

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

