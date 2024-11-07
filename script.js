const products = [];
let cart = [];
let total = 0;
let totalWithDiscount = 0;
let lastDiscountApplied = 0;
let discountAplyed = false;
let cartContainer = document.querySelector('.cart-container');
const productsContainer = document.querySelector('.productos-section');
const emojis = ["💰", "🔥", "✨", "🎯", "🚀", "💎", "🎉", "⭐", "🔖", "⚡"];

let cartLocalStorage = localStorage.getItem('cart');
if (cartLocalStorage) {
    cart = JSON.parse(cartLocalStorage);
}

let totalLocalStorage = localStorage.getItem('total');
if (totalLocalStorage) {
    total = parseFloat(totalLocalStorage);
}

updateCart();
loadProducts();

function loadProducts() {
    fetch('https://fakestoreapi.com/products')
        .then(res => res.json())
        .then(data => {
            products.push(...data);

            const tendenciasContainer = document.querySelector('.tendencias-section');

            data.forEach(product => {
                const producto = document.createElement('div');
                const emojiAleatorio = emojis[Math.floor(Math.random() * emojis.length)];
                producto.classList.add('producto-tendencia');
                producto.innerHTML = `
                        <img src="${product.image}" alt="${product.title}">
                        <h3>${product.title}</h3>
                        <span class="producto-price">$ ${product.price}${emojiAleatorio} </span> 
                        <span>${product.price < 30 ? `ultimos ${Math.floor(Math.random() * 10 + 2)} disponibles` : "nuevo"}</span> 
                        <button class="buy-button" onclick="addItem(${product.id})">Agregar al carrito</button>
                    `;
                tendenciasContainer.appendChild(producto);

            });

            data.forEach(product => {
                const producto = document.createElement('div');
                const emojiAleatorio = emojis[Math.floor(Math.random() * emojis.length)];
                producto.classList.add('producto');
                producto.dataset.id = product.id;
                producto.innerHTML = `
                        <img src="${product.image}" alt="${product.title}">
                        <h3>${product.title}</h3>
                        <span class="producto-price">$ ${product.price}${emojiAleatorio} </span> 
                        <span>${product.price < 30 ? `ultimos ${Math.floor(Math.random() * 10 + 2)} disponibles` : "nuevo"}</span> 
                        <button class="buy-button" onclick="addItem(${product.id})">Agregar al carrito</button>
                    `;
                productsContainer.appendChild(producto);
            });
        });
}

const testimonios = fetch('testimonios.json')
    .then(res => res.json())
    .then(data => {
        const container = document.querySelector('.reseñas-section-container');
        data.forEach(testimonio => {
            const reseña = document.createElement('div');
            reseña.classList.add('reseña');
            reseña.innerHTML = `
                        <img src="${testimonio.imgUrl}" alt="${testimonio.nombre}" class="reseña-img">
                        <h3>${testimonio.nombre}</h3>
                        <p>" ${testimonio.testimonio} "</p>
                    `;
            container.appendChild(reseña);
        });
    });

const cleanForm = document.querySelector('#clean-form');
cleanForm.addEventListener('click', (e) => {
    e.preventDefault();
    document.querySelector('.formulario-msg').reset();
});

const cartIcon = document.getElementById("cart-icon");
cartIcon.addEventListener("click", () => {
    cartContainer.classList.toggle("hidden");
});

function updateCart() {
    cartContainer.innerHTML = `
            <div class="cart-container-items">
                ${cart.length == 0 ? "No hay productos en tu carrito" : ""}
                ${cart.map(product => `
                    <div class="cart-item aparecer" data-id="${product.id}">
                        <img src="${product.image}" alt="${product.title}" class="cart-item-img">
                        <h3 class=""cart-item-title>${product.title.slice(0, 20)}${product.title.length > 20 ? "..." : ""}</h3>
                        <span class="cart-item-price">$ ${product.price}</span>
                        <button class="remove-button" data-id="${product.id}" onclick="removeItem(${product.id})"><img src="icons/trash.svg" alt="eliminar" class="trash-icon"></button>
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
                <button class="remove-button" onclick="clearCart()"><img src="icons/deleteCart.svg" alt="eliminar carrito" class="delete-cart-icon"></button>
            </div>
        `

}

function addItem(id) {
    cart.push(products.find(product => product.id === id));
    total += products.find(product => product.id === id).price;
    localStorage.setItem('cart', JSON.stringify(cart));
    localStorage.setItem('total', total);
    updateCart();
}

function removeItem(id) {
    cart = cart.filter(product => product.id !== id);
    total = total - products.find(product => product.id === id).price;
    if (cart.length == 0) {
        total = 0;
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    localStorage.setItem('total', total);

    updateCart();
}

function applyDiscount() {
    const input = document.querySelector('.discount-input');
    const discount = parseFloat(input.value);
    const msg = document.querySelector('.discount-msg');
    const alertMsg = document.getElementById('discount-alert');

    if (discount > 20) {
        msg.textContent = "No puedes aplicar un descuento mayor a 20%";
        return;
    }

    if (total < 400) {
        msg.textContent = "El total de tu carrito es menor a $400";
        return;
    }

    if (discountAplyed) {
        msg.textContent = "Ya has aplicado un descuento anteriormente";
        return;
    }

    discountAplyed = true;
    lastDiscountApplied = discount;
    totalWithDiscount = total - discount;
    alertMsg.classList.toggle("hidden");
    alertMsg.insertAdjacentText('beforeend', totalWithDiscount.toFixed(2));
    msg.textContent = "Descuento aplicado con exito";
}

function clearCart() {
    cart = [];
    total = 0;
    lastDiscountApplied = 0;
    localStorage.setItem('cart', JSON.stringify(cart));
    localStorage.setItem('total', total);
    localStorage.setItem('lastDiscountApplied', lastDiscountApplied);
    updateCart();
}

// BUSCAR FUNCTION

const buscarInput = document.querySelector('.buscar-input');
const buscarButton = document.querySelector('.buscar-button');
const buscarForm = document.querySelector('.buscar-form');

buscarButton.addEventListener("click", (e) => {
    e.preventDefault();
    const buscarInputValue = buscarInput.value;
    productsContainer.innerHTML = "";
    products.forEach(product => {

        if (product.title.toLowerCase().includes(buscarInputValue.toLowerCase())) {
            const producto = document.createElement('div');
            const emojiAleatorio = emojis[Math.floor(Math.random() * emojis.length)];
            producto.classList.add('producto');
            producto.dataset.id = product.id;
            producto.innerHTML = `
                        <img src="${product.image}" alt="${product.title}">
                        <h3>${product.title}</h3>
                        <span class="producto-price">$ ${product.price}${emojiAleatorio} </span> 
                        <span>${product.price < 30 ? `ultimos ${Math.floor(Math.random() * 10 + 2)} disponibles` : "nuevo"}</span> 
                        <button class="buy-button" onclick="addItem(${product.id})">Agregar al carrito</button>
                    `;
            productsContainer.appendChild(producto);
        }
    });
});

function reloadProducts() {
    productsContainer.innerHTML = '';
    products.forEach(product => {
        const producto = document.createElement('div');
        const emojiAleatorio = emojis[Math.floor(Math.random() * emojis.length)];
        producto.classList.add('producto');
        producto.dataset.id = product.id;
        producto.innerHTML = `
                        <img src="${product.image}" alt="${product.title}">
                        <h3>${product.title}</h3>
                        <span class="producto-price">$ ${product.price}${emojiAleatorio} </span> 
                        <span>${product.price < 30 ? `ultimos ${Math.floor(Math.random() * 10 + 2)} disponibles` : "nuevo"}</span> 
                        <button class="buy-button" onclick="addItem(${product.id})">Agregar al carrito</button>
                    `;
        productsContainer.appendChild(producto);
    });
};


