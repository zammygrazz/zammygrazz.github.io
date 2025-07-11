document.addEventListener('DOMContentLoaded', () => {

    let cartTable = document.getElementById('cartTable');

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
                <td><input type="number" value="${cartItem.quantity}" min="1" class="quantity-input" data-id="${cartItem.cartId}"></td>
                <td>Ksh. ${subtotal}</td>
            </tr>
        `;
        }
    });

    tableHTML += `</tbody></table>`;
    cartTable.innerHTML = tableHTML;
});
