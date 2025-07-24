
document.addEventListener("DOMContentLoaded", () => {
    const sproduct = JSON.parse(localStorage.getItem('sproduct'));
    const imgArray = JSON.parse(localStorage.getItem('storedArray'));
    let quickView = document.querySelector('.single-pro-details');
    const mainImg = document.getElementById('mainImg');
    const smallImg = document.getElementsByClassName('small-img');

    const renderQuickview = () => {
        if (!sproduct || !mainImg) return;

        mainImg.src = sproduct.img;
        quickView.querySelector('h4').textContent = sproduct.description;
        quickView.querySelector('h2').textContent = sproduct.price;

        if (imgArray && imgArray.length > 0) {
            for (let i = 0; i < smallImg.length && i < imgArray.length; i++) {
                smallImg[i].src = imgArray[i];
                smallImg[i].onclick = function () {
                    mainImg.src = this.src;
                };
            }
        }
    };

    renderQuickview();
});

