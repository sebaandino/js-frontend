const products = [];
let cart = [];
let total = 0;
let cartContainer = document.querySelector('.cart-container');

fetch('https://fakestoreapi.com/products')
    .then(res => res.json())
    .then(data => {
        products.push(...data);
        const emojis = ["💰", "🔥", "✨", "🎯", "🚀", "💎", "🎉", "⭐", "🔖", "⚡"];

        const container = document.querySelector('.productos-section');
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
            container.appendChild(producto);
        });
    });

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
                <button id="apply-discount-button">Aplicar descuento</button>
            </div>
            <div class="cart-container-total">
                <span class="cart-total-price">TOTAL = $${total.toFixed(2)}</span>
            </div>
        `
}

function addItem(id) {
    cart.push(products.find(product => product.id === id));
    total += products.find(product => product.id === id).price;
    updateCart();
}

function removeItem(id) {
    cart = cart.filter(product => product.id !== id);
    total = total - products.find(product => product.id === id).price;
    if (cart.length == 0) {
        total = 0;
    }
    updateCart();
}
