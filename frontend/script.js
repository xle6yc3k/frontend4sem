fetch("http://localhost:3000/products")
    .then(response => response.json())
    .then(products => {
        const container = document.getElementById("products");
        products.forEach(product => {
            const div = document.createElement("div");
            div.innerHTML = `<h3>${product.name}</h3>
                             <p>${product.description}</p>
                             <p>Цена: ${product.price} руб.</p>`;
            container.appendChild(div);
        });
    });
