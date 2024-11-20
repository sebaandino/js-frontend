const products = [];
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let total = parseFloat(localStorage.getItem('total')) || 0;
let totalWithDiscount = 0;
let lastDiscountApplied = 0;
let discountApplied = false;

const emojis = ["💰", "🔥", "✨", "🎯", "🚀", "💎", "🎉", "⭐", "🔖", "⚡"];
const cartButton = document.getElementById('cart-icon');
const cartContainer = document.querySelector('.cart-container');
const cartContainerItems = document.querySelector('.cart-container-items');
const productsContainer = document.querySelector('.productos-section');
const tendenciasContainer = document.querySelector('.tendencias-section');

// CARGA DE PRODUCTOS EN LA PAG
async function loadProducts() {
    const response = await fetch('https://fakestoreapi.com/products');
    const data = await response.json();
    products.push(...data);

    data.forEach(product => {
        // createProductElement(product, tendenciasContainer);
        createProductElement(product, productsContainer);
    });
}

// CREAR ELEMENTO PRODUCTO
function createProductElement(product, container) {
    const producto = document.createElement('div');
    const emojiAleatorio = emojis[Math.floor(Math.random() * emojis.length)];
    producto.classList.add('producto');
    producto.dataset.id = product.id;
    producto.innerHTML = `
        <img src="${product.image}" alt="${product.title}">
        <h3>${product.title}</h3>
        <span class="producto-price">$ ${product.price} ${emojiAleatorio}</span> 
        <span>${product.price < 30 ? `ultimos ${Math.floor(Math.random() * 10 + 2)} disponibles` : "nuevo"}</span> 
        <button class="buy-button" onclick="addItem(${product.id})">Agregar al carrito</button>
    `;
    container.appendChild(producto);
}

cartButton.addEventListener("click", () => {
    cartContainer.classList.toggle("hidden");
});

// GUARDAR CARRITO EN LOCALSTORAGE
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    localStorage.setItem('total', total);
}

// AGREGAR PRODUCTO AL CARRITO
function addItem(id) {
    const product = products.find(p => p.id === id);
    cart.push(product);
    total += product.price;
    saveCart();
    updateCart();
}

// ELIMINAR PRODUCTO DEL CARRITO
function removeItem(id) {
    const product = cart.find(p => p.id === id);
    if (product) {
        cart = cart.filter(p => p.id !== id);
        total -= product.price;
        saveCart();
        updateCart();
    }
}

// APLICAR DESCUENTO
function applyDiscount() {
    const input = document.querySelector('.discount-input');
    const discount = parseFloat(input.value);
    const discountMsg = document.getElementById('discount-msg');
    const discountTotal = document.getElementById('discount-total');

    if (discount > 20 || total < 400 || discountApplied) {
        discountMsg.textContent = discount > 20
            ? "No puedes aplicar un descuento mayor a 20%"
            : total < 400
                ? "El total de tu carrito es menor a $400"
                : "Ya has aplicado un descuento anteriormente";
        return;
    }

    discountApplied = true;
    lastDiscountApplied = discount;
    totalWithDiscount = total - (total * (discount / 100));
    discountTotal.classList.remove("hidden");
    discountTotal.textContent = `TOTAL CON DESCUENTO= $${totalWithDiscount.toFixed(2)}`;
    discountMsg.textContent = "Se aplico un descuento de " + discount + "%";
}

// LIMPIAR CARRITO
const confirmationDialog = document.getElementById('confirmationDialog');
const confirmClearCartButton = document.getElementById('confirmClearCart');
const cancelClearCartButton = document.getElementById('cancelClearCart');

function cleanCart() {
    confirmationDialog.showModal();
}

// si confirma

confirmClearCartButton.addEventListener('click', () => {
    const discountTotal = document.getElementById('discount-total');

    cart = [];
    total = 0;
    lastDiscountApplied = 0;
    discountApplied = false;
    localStorage.setItem('cart', JSON.stringify(cart));
    localStorage.setItem('total', total);
    discountTotal.classList.add("hidden");

    updateCart();

    confirmationDialog.close();
});

// si cancela
cancelClearCartButton.addEventListener('click', () => {
    confirmationDialog.close();
});

// ACTUALIZAR CARRITO

function updateCart() {
    const totalPrice = total;
    const totalWithDiscount = total - (total * (lastDiscountApplied / 100));
    const totalMsg = document.querySelector(".cart-total-price");

    cartContainerItems.innerHTML = `
            ${cart.length === 0 ? "No hay productos en tu carrito" : ""}
            ${cart.map(product => `
                <div class="cart-item" data-id="${product.id}">
                    <img src="${product.image}" alt="${product.title}" class="cart-item-img">
                    <h3 class="cart-item-title">${product.title.slice(0, 20)}${product.title.length > 20 ? "..." : ""}</h3>
                    <span class="cart-item-price">$ ${product.price}</span>
                    <button class="remove-item" data-id="${product.id}" onclick="removeItem(${product.id})">
                        <img src="icons/trash.svg" alt="eliminar" class="cart-trash-icon">
                    </button>
                </div>
            `).join('')
        }
        `;

    totalMsg.textContent = `TOTAL= $${totalPrice.toFixed(2)}`;
}

// BUSCAR FUNCTIONS

const buscarInput = document.querySelector('.buscar-input');
const buscarButton = document.querySelector('.buscar-button');

function renderProducts(productsToRender, container) {
    container.innerHTML = '';
    productsToRender.forEach(product => createProductElement(product, container));
}

function handleSearch() {
    const searchQuery = buscarInput.value.toLowerCase().trim();

    if (!searchQuery) {
        renderProducts(products, productsContainer);
        return;
    }

    const filteredProducts = products.filter(product =>
        product.title.toLowerCase().includes(searchQuery)
    );
    renderProducts(filteredProducts, productsContainer);
}

function debounce(func, delay = 400) {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), delay);
    };
}

buscarInput.addEventListener('input', debounce(handleSearch));

function reloadProducts() {
    renderProducts(products, productsContainer);
}

buscarButton.addEventListener("click", (e) => {
    e.preventDefault();
    handleSearch();
});

// TESTIMONIOS
const testimonios = fetch('testimonios.json')
    .then(res => res.json())
    .then(data => {
        const testimoniosContainer = document.querySelector('.reseñas-section-container');
        data.forEach(testimonio => {
            const reseña = document.createElement('div');
            reseña.classList.add('reseña');
            reseña.innerHTML = `
                        <img src="${testimonio.imgUrl}" alt="${testimonio.nombre}" class="reseña-img">
                        <h3>${testimonio.nombre}</h3>
                        <p>" ${testimonio.testimonio} "</p>
                    `;
            testimoniosContainer.appendChild(reseña);
        });
    });

// LIMPIAR FORMULARIO

const cleanForm = document.querySelector('#clean-form');
cleanForm.addEventListener('click', (e) => {
    e.preventDefault();
    document.querySelector('.formulario-msg').reset();
});

loadProducts();
updateCart();

const menuIcon = document.getElementById("menu-icon");
const nav = document.getElementById("header-nav");

menuIcon.addEventListener("click", () => {

    nav.classList.toggle("hidden-nav");
});