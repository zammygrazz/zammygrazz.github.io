// data.js
export async function fetchProducts() {
    const response = await fetch('test.json');
    if (!response.ok) throw new Error('Failed to fetch products');
    return await response.json();
}

export function loadCartFromStorage() {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
}

export function saveCartToStorage(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}


// cart.js
import { saveCartToStorage } from './data.js';

export function addToCart(productId, cart) {
    const index = cart.findIndex(item => item.cartId === productId);
    if (index >= 0) {
        cart[index].quantity += 1;
    } else {
        cart.push({ cartId: productId, quantity: 1 });
    }
    saveCartToStorage(cart);
}

export function updateCartQuantity(productId, change, cart) {
    const index = cart.findIndex(item => item.cartId === productId);
    if (index >= 0) {
        cart[index].quantity += change;
        if (cart[index].quantity <= 0) cart.splice(index, 1);
        saveCartToStorage(cart);
    }
}

export function renderCart(cart, products, container, span) {
    container.innerHTML = '';
    let totalQuantity = 0;

    cart.forEach(item => {
        const product = products.find(p => p.id == item.cartId);
        if (!product) return;

        totalQuantity += item.quantity;

        const itemDiv = document.createElement('div');
        itemDiv.classList.add('item');
        itemDiv.dataset.id = item.cartId;

        itemDiv.innerHTML = `
            <img src="${product.img}" alt="">
            <div class="name">${product.brand}</div>
            <div class="totalPrice">ksh. ${product.price}</div>
            <div class="quantity">
                <span class="minus">-</span>
                <span>${item.quantity}</span>
                <span class="plus">+</span>
            </div>
        `;
        container.appendChild(itemDiv);
    });

    span.innerHTML = totalQuantity;
}


// pagination.js
export function setupPagination(products, productsPerPage, currentPage, container, onPageChange) {
    const totalPages = Math.ceil(products.length / productsPerPage);
    container.innerHTML = '';

    for (let i = 1; i <= totalPages; i++) {
        const link = document.createElement('a');
        link.href = '#';
        link.textContent = i;

        if (i === currentPage) link.classList.add('active');

        link.addEventListener('click', e => {
            e.preventDefault();
            onPageChange(i);
        });

        container.appendChild(link);
    }

    if (currentPage < totalPages) {
        const next = document.createElement('a');
        next.href = '#';
        next.innerHTML = `<i class="fal fa-long-arrow-alt-right"></i>`;
        next.addEventListener('click', e => {
            e.preventDefault();
            onPageChange(currentPage + 1);
        });
        container.appendChild(next);
    }
}


// product.js
export function displayProducts(products, container) {
    container.innerHTML = `
        <h2>Featured Products</h2>
        <p>Summer Collection New Modern Design</p>
        <div class="pro-container"></div>
    `;

    const proContainer = container.querySelector('.pro-container');
    products.forEach(product => {
        proContainer.innerHTML += `
            <div class="pro" data-id="${product.id}">
                <img src="${product.img}" alt="">
                <div class="des">
                    <span>${product.brand}</span>
                    <h5>${product.description}</h5>
                    <div class="star">
                        <li class="fas fa-star"></li>
                        <li class="fas fa-star"></li>
                        <li class="fas fa-star"></li>
                        <li class="fas fa-star"></li>
                        <li class="fas fa-star"></li>
                    </div>
                    <h4>${product.price}</h4>
                </div>
                <a href="#"><i class="fal fa-shopping-cart cart" data-id="${product.id}"></i></a>
            </div>
        `;
    });
}


// ui.js
export function setupNavToggles(sideBar, nav, cancel) {
    sideBar.addEventListener('click', () => nav.classList.toggle('active'));
    cancel.addEventListener('click', e => {
        e.preventDefault();
        nav.classList.toggle('active');
    });
}

export function setupCartToggle(iconCart, closeCart, body) {
    iconCart.addEventListener('click', () => body.classList.toggle('showCart'));
    closeCart.addEventListener('click', () => body.classList.toggle('showCart'));
}


// main.js
import { fetchProducts, loadCartFromStorage } from './data.js';
import { displayProducts } from './product.js';
import { addToCart, updateCartQuantity, renderCart } from './cart.js';
import { setupPagination } from './pagination.js';
import { setupNavToggles, setupCartToggle } from './ui.js';

document.addEventListener('DOMContentLoaded', async () => {
    const container = document.getElementById('product1');
    const pagination = document.getElementById('pagination');
    const iconCart = document.querySelector('.icon-cart');
    const closeCart = document.querySelector('.close');
    const listCartHTML = document.querySelector('.listCart');
    const span = document.querySelector('.span');
    const body = document.body;
    const sideBar = document.getElementById('mobile');
    const nav = document.getElementById('navbar');
    const cancel = document.getElementById('cancel');

    setupNavToggles(sideBar, nav, cancel);
    setupCartToggle(iconCart, closeCart, body);

    let products = await fetchProducts();
    let cart = loadCartFromStorage();
    let currentPage = 1;
    const productsPerPage = 8;

    function loadPage(page) {
        currentPage = page;
        const start = (page - 1) * productsPerPage;
        const end = start + productsPerPage;
        const pageProducts = products.slice(start, end);
        displayProducts(pageProducts, container);
        setupPagination(products, productsPerPage, page, pagination, loadPage);
    }

    container.addEventListener('click', e => {
        const target = e.target;

        if (target.classList.contains('cart')) {
            e.preventDefault();
            addToCart(target.dataset.id, cart);
            renderCart(cart, products, listCartHTML, span);
        } else {
            const product = target.closest('.pro');
            if (product) {
                const imgSrc = product.querySelector('img').src;
                const relativeImg = imgSrc.replace(window.location.origin + '/', '');
                const productData = products.find(p => p.img === relativeImg);
                if (productData) {
                    localStorage.setItem('sproduct', JSON.stringify(productData));
                    localStorage.setItem('storedArray', JSON.stringify(productData.subCategory || []));
                    window.location.href = 'sproduct.html';
                }
            }
        }
    });

    listCartHTML.addEventListener('click', e => {
        const item = e.target.closest('.item');
        if (!item) return;
        const id = item.dataset.id;

        if (e.target.classList.contains('plus')) {
            updateCartQuantity(id, 1, cart);
        } else if (e.target.classList.contains('minus')) {
            updateCartQuantity(id, -1, cart);
        }

        renderCart(cart, products, listCartHTML, span);
    });

    loadPage(currentPage);
    renderCart(cart, products, listCartHTML, span);
});
