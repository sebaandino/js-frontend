const products = [];
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let total = parseFloat(localStorage.getItem('total')) || 0;
let totalWithDiscount = 0;
let lastDiscountApplied = 0;
let discountApplied = false;

const emojis = ["💰", "🔥", "✨", "🎯", "🚀", "💎", "🎉", "⭐", "🔖", "⚡"];
const cartContainer = document.querySelector('.cart-container');
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
    const msg = document.querySelector('.discount-msg');
    const alertMsg = document.getElementById('discount-alert');

    if ( discount > 20 || total < 400 || discountApplied) {
        msg.textContent = discount > 20
            ? "No puedes aplicar un descuento mayor a 20%"
            : total < 400
            ? "El total de tu carrito es menor a $400"
            : "Ya has aplicado un descuento anteriormente";
        return;
    }

    discountApplied = true;
    lastDiscountApplied = discount;
    totalWithDiscount = total - (total * (discount / 100));
    alertMsg.classList.remove("hidden");
    alertMsg.textContent = `TOTAL CON DESCUENTO= $${totalWithDiscount.toFixed(2)}`;
    msg.textContent = "Se aplico un descuento de " + discount + "%";
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
    cart = [];
    total = 0;
    lastDiscountApplied = 0;
    discountApplied = false;
    localStorage.setItem('cart', JSON.stringify(cart));
    localStorage.setItem('total', total);
    updateCart();

    confirmationDialog.close();
});

// si cancela
cancelClearCartButton.addEventListener('click', () => {
    confirmationDialog.close();
});

// ACTUALIZAR CARRITO

const cartIcon = document.getElementById("cart-icon");
cartIcon.addEventListener("click", () => {
    cartContainer.classList.toggle("hidden");
});

function updateCart() {
    cartContainer.innerHTML = `
        <div class="cart-container-items">
            ${cart.length === 0 ? "No hay productos en tu carrito" : ""}
            ${cart.map(product => `
                <div class="cart-item aparecer" data-id="${product.id}">
                    <img src="${product.image}" alt="${product.title}" class="cart-item-img">
                    <h3 class="cart-item-title">${product.title.slice(0, 20)}${product.title.length > 20 ? "..." : ""}</h3>
                    <span class="cart-item-price">$ ${product.price}</span>
                    <button class="remove-button" data-id="${product.id}" onclick="removeItem(${product.id})">
                        <img src="icons/trash.svg" alt="eliminar" class="trash-icon">
                    </button>
                </div>
            `).join('')}
        </div>
        <div class="cart-container-discount">
            <img src="icons/percent.svg" alt="descuento" class="discount-icon">
            <input type="text" placeholder="Ingrese su cupon" class="discount-input">
            <button id="apply-discount-button" onclick="applyDiscount()">Aplicar</button>
        </div>
        <span class="discount-msg"> Los descuentos se pueden aplicar a partir de $400 </span>
        <div class="cart-footer">
            <div class="cart-container-total">
                <span class="cart-total-price">TOTAL = $${total.toFixed(2)}</span>
                <span class="cart-total-price hidden" id="discount-alert">TOTAL CON DESCUENTO= $</span>
            </div>
            <button class="remove-button" onclick="cleanCart()">
                <img src="icons/deleteCart.svg" alt="eliminar carrito" class="delete-cart-icon">
            </button>
        </div>
    `;
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
const closeMenuIcon = document.getElementById("close-menu-icon");
const header = document.getElementById("header");

menuIcon.addEventListener("click", () => {
        
    header.style.display = "flex";
    closeMenuIcon.style.display = "block";
    menuIcon.style.display = "none";
    header.style.animation = "abrirMenu .5s ease-in";
});

closeMenuIcon.addEventListener("click", () => {
    
    closeMenuIcon.style.display = "none";
    menuIcon.style.display = "block";
    header.style.display = "none";
    header.style.animation = "cerrarMenu .5s ease-in-out";
});