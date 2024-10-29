fetch('https://fakestoreapi.com/products')
    .then(res => res.json())
    .then(data => {

        const emojis = ["💰", "🔥", "✨", "🎯", "🚀", "💎", "🎉", "⭐", "🔖", "⚡"];
        
        const container = document.querySelector('.productos-section');
        data.forEach(product => {
            const producto = document.createElement('div');
            const emojiAleatorio = emojis[Math.floor(Math.random() * emojis.length)];
            producto.classList.add('producto');
            producto.innerHTML = `
                        <img src="${product.image}" alt="${product.title}">
                        <h3>${product.title}</h3>
                        <span class="producto-price">$ ${product.price}${emojiAleatorio} </span> 
                        <span>${product.price < 30 ? `ultimos ${Math.floor(Math.random() * 10 +2)} disponibles` :"nuevo" }</span> 
                        <button class="buy-button">Comprar</button>
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

    const cartContainer = document.querySelector('.cart-container');
    const cartIcon = document.getElementById("cart-icon");
    cartIcon.addEventListener("click",() => {
        cartContainer.classList.toggle("hidden");
    });
    