document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const cartTable = document.getElementById('cartTable');
    const orderBtn = document.getElementById('order');
    const cartSubtotal = document.getElementById('cartSubtotal');
    const cartTotal = document.getElementById('cartTotal');

    // Data
    let carts = JSON.parse(localStorage.getItem('cart')) || [];
    const allProducts = JSON.parse(localStorage.getItem('allProducts')) || [];

    // Initialize cart
    renderCartTable();
    setupEventListeners();
    updateCartTotals();

    function renderCartTable() {
        if (!cartTable) return;

        let tableHTML = `
            <table width="100%">
                <thead>
                    <tr>
                        <td>Remove</td>
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
            const product = allProducts.find(p => p.id == cartItem.productId || p.id == cartItem.cartId);
            if (product) {
                const price = parseFloat(product.price.replace(/[^0-9.]/g, ''));
                const subtotal = price * cartItem.quantity;

                tableHTML += `
                    <tr data-id="${cartItem.cartId}">
                        <td><button class="remove-btn" data-id="${cartItem.cartId}">
                            <i class="far fa-times-circle"></i>
                        </button></td>
                        <td><img src="${product.img}" alt="${product.description}"></td>
                        <td>${product.description} (${cartItem.size || 'M'})</td>
                        <td>Ksh. ${price.toFixed(2)}</td>
                        <td>
                            <div class="quantity-control">
                                <button class="qty-minus" data-id="${cartItem.cartId}">-</button>
                                <input type="number" value="${cartItem.quantity}" min="1" 
                                       class="quantity-input" data-id="${cartItem.cartId}">
                                <button class="qty-plus" data-id="${cartItem.cartId}">+</button>
                            </div>
                        </td>
                        <td>Ksh. ${subtotal.toFixed(2)}</td>
                    </tr>
                `;
            }
        });

        tableHTML += `</tbody></table>`;
        cartTable.innerHTML = carts.length ? tableHTML : '<p>Your cart is empty</p>';
    }

    function setupEventListeners() {
        // Quantity changes
        cartTable.addEventListener('click', (e) => {
            const target = e.target.closest('.qty-minus, .qty-plus, .remove-btn');
            if (!target) return;

            const cartId = target.dataset.id;
            const cartItem = carts.find(item => item.cartId === cartId);
            if (!cartItem) return;

            if (target.classList.contains('qty-minus')) {
                cartItem.quantity = Math.max(1, cartItem.quantity - 1);
            } else if (target.classList.contains('qty-plus')) {
                cartItem.quantity += 1;
            } else if (target.classList.contains('remove-btn')) {
                carts = carts.filter(item => item.cartId !== cartId);
            }

            updateCart();
        });

        // Input changes
        cartTable.addEventListener('change', (e) => {
            if (!e.target.classList.contains('quantity-input')) return;

            const cartId = e.target.dataset.id;
            const newQty = parseInt(e.target.value) || 1;

            const cartItem = carts.find(item => item.cartId === cartId);
            if (cartItem) {
                cartItem.quantity = Math.max(1, newQty);
                updateCart();
            }
        });

        // Form validation
        ['firstname', 'lastname', 'phone', 'email', 'address'].forEach(id => {
            const input = document.getElementById(id);
            input?.addEventListener('input', () => {
                input.classList.remove('input-error');
                const errorSpan = document.getElementById(`error-${id}`);
                if (errorSpan) errorSpan.textContent = '';
            });
        });

        // Order button
        orderBtn?.addEventListener('click', processOrder);
    }

    function updateCart() {
        localStorage.setItem('cart', JSON.stringify(carts));
        // Notify other scripts to sync immediately
        window.dispatchEvent(new CustomEvent('cartUpdated', { detail: carts }));
        renderCartTable();
        updateCartTotals();
        updateCartIcon();
    }
    
    // If another script updates the cart (same page), re-render table/totals
    window.addEventListener('cartUpdated', (e) => {
        carts = e?.detail || JSON.parse(localStorage.getItem('cart')) || [];
        renderCartTable();
        updateCartTotals();
        updateCartIcon();
    });

    function updateCartTotals() {
        if (!cartSubtotal || !cartTotal) return;

        const total = carts.reduce((sum, item) => {
            const product = allProducts.find(p => p.id == item.productId || p.id == item.cartId);
            if (product) {
                const price = parseFloat(product.price.replace(/[^0-9.]/g, ''));
                return sum + (price * item.quantity);
            }
            return sum;
        }, 0);

        cartSubtotal.textContent = `Ksh. ${total.toFixed(2)}`;
        cartTotal.textContent = `Ksh. ${total.toFixed(2)}`;
    }

    function updateCartIcon() {
        const cartIcon = document.querySelector('.icon-cart .span');
        if (cartIcon) {
            cartIcon.textContent = carts.reduce((sum, item) => sum + item.quantity, 0);
        }
    }

    function processOrder() {
        // Validate form
        const requiredFields = {
            firstname: 'First name is required',
            lastname: 'Last name is required',
            phone: 'Phone number is required',
            address: 'Delivery address is required'
        };

        let hasError = false;
        for (const [field, message] of Object.entries(requiredFields)) {
            const element = document.getElementById(field);
            const errorElement = document.getElementById(`error-${field}`);

            if (!element?.value.trim()) {
                element?.classList.add('input-error');
                if (errorElement) errorElement.textContent = message;
                hasError = true;
            }
        }

        if (hasError || carts.length === 0) {
            if (carts.length === 0) alert('Your cart is empty!');
            return;
        }

        // Prepare WhatsApp message
        const formData = {
            firstname: document.getElementById('firstname').value.trim(),
            lastname: document.getElementById('lastname').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            email: document.getElementById('email').value.trim(),
            address: document.getElementById('address').value.trim(),
            notes: document.getElementById('notes').value.trim()
        };

        let message = `*NEW ORDER*%0A%0A*Items:*%0A`;

        const grandTotal = carts.reduce((total, item) => {
            const product = allProducts.find(p => p.id == item.productId || p.id == item.cartId);
            if (product) {
                const price = parseFloat(product.price.replace(/[^0-9.]/g, ''));
                const subtotal = price * item.quantity;
                message += `- ${product.description} (${item.size || 'M'}) x${item.quantity} - Ksh. ${subtotal.toFixed(2)}%0A`;
                return total + subtotal;
            }
            return total;
        }, 0);

        message += `%0A*Total: Ksh. ${grandTotal.toFixed(2)}*%0A%0A`;
        message += `*Customer Details*%0A`;
        message += `Name: ${formData.firstname} ${formData.lastname}%0A`;
        message += `Phone: ${formData.phone}%0A`;
        if (formData.email) message += `Email: ${formData.email}%0A`;
        message += `Address: ${formData.address}%0A`;
        if (formData.notes) message += `Notes: ${formData.notes}`;

        // Open WhatsApp
        const phoneNumber = "254728178044"; // Your WhatsApp number
        window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
    }
});