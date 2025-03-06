import { ApolloClient, InMemoryCache, gql } from "https://esm.sh/@apollo/client@3.8.0/core";

// 📌 Настраиваем Apollo Client
const client = new ApolloClient({
    uri: "http://localhost:3000/graphql",
    cache: new InMemoryCache()
});

// 📌 Определяем GraphQL-запросы
const queries = {
    all: gql`query { getAllProducts { id name price description category } }`,
    namesPrices: gql`query { getProductNamesAndPrices { name price } }`,
    namesDescriptions: gql`query { getAllProducts { name description } }`,
    categories: gql`query { getCategories }`
};

// 📌 Загружаем категории в фильтр
async function loadCategories() {
    try {
        const response = await client.query({ query: queries.categories });
        const categories = response.data.getCategories;

        const categorySelector = document.getElementById("categorySelector");
        categorySelector.innerHTML = `<option value="all">Все категории</option>`;
        categories.forEach(category => {
            categorySelector.innerHTML += `<option value="${category}">${category}</option>`;
        });

        console.log("📌 Категории загружены:", categories);
    } catch (error) {
        console.error("❌ Ошибка загрузки категорий:", error);
    }
}

// 📌 Загружаем товары (с учётом выбранных фильтров)
async function loadProducts() {
    const selectedQuery = document.getElementById("dataSelector").value;
    const selectedCategory = document.getElementById("categorySelector").value;

    try {
        console.log(`🔍 Запрос GraphQL: ${selectedQuery}`);
        const response = await client.query({ query: queries[selectedQuery] });
        let products = response.data.getAllProducts || response.data.getProductNamesAndPrices;

        // Фильтруем по категории
        if (selectedCategory !== "all") {
            products = products.filter(p => p.category && p.category.includes(selectedCategory));
        }

        console.log("📌 Найдено товаров:", products.length);
        renderProducts(products);
    } catch (error) {
        console.error("❌ Ошибка загрузки товаров:", error);
    }
}

// 📌 Рендеринг карточек товаров
function renderProducts(products) {
    const container = document.getElementById("products");
    container.innerHTML = "";

    if (products.length === 0) {
        container.innerHTML = "<h4>❌ Нет товаров в данной категории</h4>";
        return;
    }

    products.forEach(product => {
        const col = document.createElement("div");
        col.className = "col-md-4 col-sm-6 mb-4";

        let content = `<h5 class="card-title">${product.name}</h5>`;
        if (product.price) content += `<p class="price"><strong>${product.price} ₽</strong></p>`;
        if (product.description) content += `<p class="description">${product.description}</p>`;

        col.innerHTML = `<div class="card h-100 shadow-sm"><div class="card-body">${content}</div></div>`;
        container.appendChild(col);
    });

    console.log("✅ Карточки товаров отрисованы!");
}

// 📌 Кнопка "Применить фильтр"
document.getElementById("applyFilter").addEventListener("click", loadProducts);

// 📌 Загружаем категории и товары при загрузке страницы
document.addEventListener("DOMContentLoaded", async () => {
    console.log("🚀 Загружаем данные...");
    await loadCategories();
    loadProducts();
});

// 📌 WebSocket клиент (ЧАТ)
const socket = new WebSocket("ws://localhost:8080");

// 📌 Подключение к WebSocket
socket.addEventListener("open", () => {
    console.log("✅ WebSocket подключён (Пользователь)");
});

// 📌 Обработчик входящих сообщений
socket.addEventListener("message", (event) => {
    try {
        const messageData = JSON.parse(event.data);
        console.log("📩 Новое сообщение от админа:", messageData);
        displayMessage(messageData.text, "admin");
    } catch (error) {
        console.error("❌ Ошибка парсинга входящего сообщения:", error);
    }
});

// 📌 Отправка сообщения (кнопка + Enter)
const messageInput = document.getElementById("chat-message");
const sendButton = document.getElementById("send-message");

sendButton.addEventListener("click", sendMessage);
messageInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        sendMessage();
    }
});

function sendMessage() {
    const message = messageInput.value.trim();
    if (message) {
        const messageData = { text: message, sender: "user" };
        socket.send(JSON.stringify(messageData));
        displayMessage(`Вы: ${message}`, "user");
        messageInput.value = "";
    }
}

// 📌 Функция отображения сообщений в чате
function displayMessage(message, sender) {
    const chatBox = document.getElementById("chat-box");

    const messageElement = document.createElement("div");
    messageElement.textContent = message;
    messageElement.classList.add("p-2", "rounded", "mb-2");

    if (sender === "user") {
        messageElement.classList.add("bg-primary", "text-white", "text-end", "ms-auto");
    } else {
        messageElement.classList.add("bg-light", "text-dark", "text-start");
    }

    chatBox.appendChild(messageElement);

    // Прокручиваем чат вниз
    chatBox.scrollTop = chatBox.scrollHeight;
}
