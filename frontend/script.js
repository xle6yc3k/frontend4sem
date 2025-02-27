fetch("http://localhost:3000/products")
    .then(response => response.json())
    .then(products => {
        console.log("Загруженные товары:", products); // Проверяем данные
        const container = document.getElementById("products");

        if (!container) {
            console.error("Элемент #products не найден!");
            return;
        }

        container.innerHTML = ""; // Очищаем перед добавлением

        products.forEach(product => {
            const col = document.createElement("div");
            col.className = "col-md-4 col-sm-6 mb-4";

            col.innerHTML = `
                <div class="card h-100 shadow-sm">
                    <div class="card-body">
                        <h5 class="card-title">${product.name}</h5>
                        <p class="card-text">${product.description}</p>
                        <p class="price"><strong>${product.price} ₽</strong></p>
                        <button class="btn btn-primary">Купить</button>
                    </div>
                </div>
            `;

            container.appendChild(col);
        });
    })
    .catch(error => console.error("Ошибка загрузки товаров:", error));
