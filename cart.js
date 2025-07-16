document.addEventListener('DOMContentLoaded', () => {

    let cartTable = document.getElementById('cartTable');
    let orderBtn = document.getElementById('order');

    // Parse stored items
    let carts = JSON.parse(localStorage.getItem('cart')) || [];
    let allProducts = JSON.parse(localStorage.getItem('allProducts')) || [];

    console.log('ALL THE PRODUCTS ARE', allProducts);
    console.log('CART ITEMS ARE', carts);

    // Build the cart table dynamically
    let tableHTML = `
    <table width="100%">
        <thead>
            <tr>
                <td>Image</td>
                <td>Product</td>
                <td>Price</td>
                <td>Quantity</td>
                <td>Subtotal</td>
            </tr>
        </thead>
        <tbody>
`;

    carts.forEach(cartItem => {
        let match = allProducts.find(product => product.id == cartItem.cartId);
        if (match) {
            const subtotal = parseInt(match.price.replace(/[^0-9]/g, '')) * cartItem.quantity;

            tableHTML += `
            <tr>
                
                <td><img src="${match.img}" alt=""></td>
                <td>${match.description}</td>
                <td>Ksh. ${match.price}</td>
                <td><input type="text" value="${cartItem.quantity}" min="1" class="quantity-input" data-id="${cartItem.cartId}"></td>
                <td>Ksh. ${subtotal}</td>
            </tr>
        `;
        }
    });

    tableHTML += `</tbody></table>`;
    cartTable.innerHTML = tableHTML;

    orderBtn.addEventListener('click', () => {


        let message = "🛒 *My Order Details*:%0A";
        let grandTotal = 0;

        carts.forEach(item => {
            let product = allProducts.find(p => p.id == item.cartId);
            if (product) {
                let subtotal = Number(product.price) * item.quantity;
                grandTotal += subtotal;
                message += `* ${product.description} (${item.size}) x${item.quantity} - Ksh. ${subtotal}%0A`;
            }
        });

        message += `%0A*Total: Ksh. ${grandTotal}*%0A`;
        message += "Name: _______%0AAddress: _______%0APlease fill in your details.";

        // ✅ 3. Encode message and open WhatsApp
        let phoneNumber = "254728178044"; // change to your phone number with country code
        let whatsappURL = `https://wa.me/${phoneNumber}?text=${message}`;

        window.open(whatsappURL, '_blank');
    });





});
