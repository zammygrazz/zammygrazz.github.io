document.addEventListener('DOMContentLoaded', () => {
    let mainImg = document.getElementById('mainImg');
    let smallImg = document.getElementsByClassName('small-img');
    let selectedImage = localStorage.getItem("selectedImage");
    let sproduct = JSON.parse(localStorage.getItem('sproduct')) || [];
    let imgArray = JSON.parse(localStorage.getItem('storedArray')) || [];
    let quickView = document.querySelector('.single-pro-details');
    if (selectedImage && imgArray) {
        mainImg.src = selectedImage;
        console.log("This is the image array", imgArray);

    } else {
        console.error("mainImg element not found in sproduct.html");
    }



    if (imgArray.length > 0) {
        for (let i = 0; i < imgArray.length; i++) {
            if (imgArray[i]) {
                smallImg[i].src = imgArray[i];
                smallImg[i].onclick = function () {
                    mainImg.src = this.src;
                };
            }
        }
    }

    const showContent = (sproduct) => {

        quickView.querySelector('h4').textContent = sproduct.description;
        quickView.querySelector('h2').textContent = sproduct.price;



    }

    showContent(sproduct);



    document.getElementById('addToCartBtn').addEventListener('click', () => {
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

        const uniqueCartId = `${sproduct.id}`;
        let carts = JSON.parse(localStorage.getItem("cart")) || [];

        const existingIndex = carts.findIndex(item => item.cartId === uniqueCartId);
        if (existingIndex >= 0) {
            carts[existingIndex].quantity += quantity;
            carts[existingIndex].size = selectedSize;
        } else {
            carts.push({
                cartId: sproduct.id,
                quantity: quantity,
                size: selectedSize
            });
        }

        localStorage.setItem("cart", JSON.stringify(carts));
        //addToCart(sproduct.id);
        addCartToHTML();

        alert("Product added to cart!");
    });




});