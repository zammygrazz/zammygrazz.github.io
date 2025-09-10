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
        let match = allProducts.find(product => product.id == cartItem.productId);
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


    //Live validation clearing when empty

    ['firstname', 'lastname', 'phone', "email", 'address', 'notes'].forEach(id => {
        const input = document.getElementById(id)
        input.addEventListener('input', () => {
            input.classList.remove('input-error');
            const errorSpan = document.getElementById(`error-${id}`);
            if (errorSpan) errorSpan.textContent = '';
        });
    });


    orderBtn.addEventListener('click', () => {

        // Get values
        const firstName = document.getElementById('firstname').value.trim();
        const lastName = document.getElementById('lastname').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const email = document.getElementById('email').value.trim();
        const address = document.getElementById('address').value.trim();
        const notes = document.getElementById('notes').value.trim();


        // Clear previous error messages
        document.querySelectorAll(".error-msg").forEach(span => span.textContent = '');

        let hasError = false;

        // Field-specific error handling
        if (!firstName) {
            document.getElementById('error-firstname').textContent = "First name is required.";
            document.getElementById('firstname').classList.add('input-error');
            hasError = true;
        }
        if (!lastName) {
            document.getElementById('error-lastname').textContent = "Last name is required.";
            document.getElementById('lastname').classList.add('input-error');
            hasError = true;
        }

        if (!phone) {
            document.getElementById('error-phone').textContent = "Phone number is required.";
            document.getElementById('phone').classList.add('input-error');
            hasError = true;
        }
        if (!address) {
            document.getElementById('error-address').textContent = "Address is required.";
            document.getElementById('address').classList.add('input-error');
            hasError = true;
        }

        if (hasError) return; // Stop if there are errors


        let message = "🛒 *My Order Details*:%0A";
        let grandTotal = 0;

        carts.forEach(item => {
            const baseProductId = cartItem.cartId.split('_')[0];
            const product = allProducts.find(p => p.id == baseProductId);
            if (product) {
                let subtotal = Number(product.price) * item.quantity;
                grandTotal += subtotal;
                message += `* ${product.description} (${item.size}) x${item.quantity} - Ksh. ${subtotal}%0A`;
            }
        });

        message += `%0A*Total: Ksh. ${grandTotal}*%0A`;
        message += `%0A👤 *Name:* ${firstName} ${lastName}%0A📞 *Phone:* ${phone}`;
        if (email) message += `%0A📧 *Email:* ${email}`;
        message += `%0A🏠 *Address:* ${address}`;
        if (notes) message += `%0A📝 *Notes:* ${notes}`;

        // ✅ 3. Encode message and open WhatsApp
        let phoneNumber = "+254728178044"; // change to your phone number with country code
        let whatsappURL = `https://wa.me/${phoneNumber}?text=${message}`;

        window.open(whatsappURL, '_blank');
    });





});
