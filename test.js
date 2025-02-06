{/* <div class="pro">
    <img src="img/products/f1.jpg" alt="Product Image" onclick="redirectToProduct(this)">
</div>

<script>
    function redirectToProduct(imgElement) {
        let imgSrc = imgElement.src; // Get image source
        localStorage.setItem("selectedImage", imgSrc); // Store in localStorage
        window.location.href = 'sproduct.html'; // Redirect
    }
</script>


<h1>Selected Product</h1>
    <img id="productImage" src="" alt="Selected Product" style="width: 300px; height: auto;">

    <script>
        // Retrieve image source from localStorage
        let selectedImage = localStorage.getItem("selectedImage");

        // Check if there's an image source and update the image
        if (selectedImage) {
            document.getElementById("productImage").src = selectedImage;
        }
    </script> */}


let product = document.getElementsByClassName('pro');
let listProduct = [];




const addDataHTML = () => {
    product.innerHTML = '';
    if (listProduct.length > 0) {
        listProduct.array.forEach(element => {
            let mainImg = document.createElement('img');
            mainImg.src = element.img;
            mainImg.alt = element.brand;

            let newProduct = document.createElement('div');
            newProduct.classList.add('pro');

            newProduct.innerHTML = `
            
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

            
            `;

            product.appendChild(mainImg);
            product.appendChild(newProduct);


        });

    }
}



async function initApp() {

    try {

        let myPromise = await fetch('test.json');
        if (!myPromise.ok) {
            console.error("network response not okay");
            return;
        }
        const data = await myPromise.json();
        listProduct = data;
        addDataHTML();

    } catch (error) {

        console.log(error);
    }
}