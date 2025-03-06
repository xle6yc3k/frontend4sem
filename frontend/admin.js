const apiUrl = "http://localhost:8080/admin/products";
const socket = new WebSocket("ws://localhost:8080/admin");

// 📌 Загружаем товары
function loadProducts() {
    fetch(apiUrl)
        .then(response => response.json())
        .then(products => {
            const table = document.getElementById("productTable");
            table.innerHTML = "";
            products.forEach(product => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${product.id}</td>
                    <td>${product.name}</td>
                    <td>${product.price} ₽</td>
                    <td>${product.description}</td>
                    <td>${product.category.join(", ")}</td>
                    <td>
                        <button class="btn btn-warning btn-sm" onclick="editProduct(${product.id})">Редактировать</button>
                        <button class="btn btn-danger btn-sm" onclick="deleteProduct(${product.id})">Удалить</button>
                    </td>
                `;
                table.appendChild(row);
            });
        })
        .catch(error => console.error("Ошибка загрузки товаров:", error));
}

// 📌 Подключение WebSocket (чат)
socket.addEventListener("open", () => {
    console.log("✅ WebSocket подключён (Администратор)");
});

// 📌 Обработчик входящих сообщений
socket.addEventListener("message", (event) => {
    try {
        const message = JSON.parse(event.data);
        console.log("📩 Новое сообщение от пользователя:", message);
        displayMessage(message, "received");
    } catch (error) {
        console.error("❌ Ошибка обработки входящего сообщения:", error);
    }
});

// 📌 Отправка сообщения
const messageInput = document.getElementById("chat-message");
document.getElementById("send-message").addEventListener("click", sendMessage);

messageInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        sendMessage();
    }
});

function sendMessage() {
    const message = messageInput.value.trim();
    if (message) {
        const msgData = { text: message, sender: "admin" };
        socket.send(JSON.stringify(msgData));
        displayMessage(msgData, "sent");
        messageInput.value = "";
    }
}

// 📌 Функция отображения сообщений в чате
function displayMessage(message, type) {
    const chatBox = document.getElementById("chat-box");
    const messageElement = document.createElement("div");

    // Префикс сообщений
    const prefix = type === "sent" ? "Админ: " : "Пользователь: ";
    messageElement.textContent = `${prefix}${message.text}`;

    // Стилизация сообщений
    messageElement.classList.add("p-2", "rounded");
    messageElement.style.marginBottom = "5px";
    messageElement.style.width = "fit-content";
    messageElement.style.maxWidth = "80%";

    if (type === "sent") {
        messageElement.classList.add("text-end", "bg-success", "text-white", "ms-auto");
    } else {
        messageElement.classList.add("text-start", "bg-primary", "text-white");
    }

    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// 📌 Редактирование товара
function editProduct(id) {
    fetch(apiUrl)
        .then(response => response.json())
        .then(products => {
            const product = products.find(p => p.id === id);
            if (product) {
                document.getElementById("name").value = product.name;
                document.getElementById("price").value = product.price;
                document.getElementById("description").value = product.description;
                document.getElementById("category").value = product.category.join(", ");
                document.getElementById("productForm").dataset.editId = id;
                document.getElementById("submitButton").textContent = "Сохранить изменения";
            }
        })
        .catch(error => console.error("Ошибка при редактировании товара:", error));
}

// 📌 Добавление или обновление товара
document.getElementById("productForm").addEventListener("submit", function (event) {
    event.preventDefault();
    const editId = this.dataset.editId; // Проверяем, редактируем или создаём новый товар

    const name = document.getElementById("name").value;
    const price = document.getElementById("price").value;
    const description = document.getElementById("description").value;
    const category = document.getElementById("category").value.split(",").map(c => c.trim());

    const updatedProduct = { name, price: Number(price), description, category };

    if (editId) {
        // 📌 Если редактируем товар
        fetch(`${apiUrl}/${editId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedProduct)
        })
        .then(() => {
            loadProducts();
            document.getElementById("productForm").reset();
            delete this.dataset.editId; // Сбрасываем режим редактирования
            document.getElementById("submitButton").textContent = "Добавить товар";
        })
        .catch(error => console.error("Ошибка при обновлении товара:", error));
    } else {
        // 📌 Если создаём новый товар
        fetch(apiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedProduct)
        })
        .then(() => {
            loadProducts();
            document.getElementById("productForm").reset();
        })
        .catch(error => console.error("Ошибка при добавлении товара:", error));
    }
});

// 📌 Удаление товара
function deleteProduct(id) {
    if (confirm("Удалить этот товар?")) {
        fetch(`${apiUrl}/${id}`, { method: "DELETE" })
            .then(() => loadProducts())
            .catch(error => console.error("Ошибка при удалении товара:", error));
    }
}

// 📌 Загружаем товары при загрузке страницы
document.addEventListener("DOMContentLoaded", loadProducts);
