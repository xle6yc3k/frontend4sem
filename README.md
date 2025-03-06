🛍 Интернет-магазин с админ-панелью и WebSocket-чатом
📌 Описание проекта
Проект представляет собой интернет-магазин с админ-панелью, в котором можно:
✅ Просматривать товары через GraphQL API
✅ Фильтровать товары по категориям
✅ Добавлять, редактировать и удалять товары через админ-панель
✅ Вести чат между пользователем и администратором через WebSocket

🚀 Фронтенд
Используемые технологии:

HTML, CSS, JavaScript — базовая разметка и логика
Bootstrap 5 — адаптивный дизайн и стилизация
GraphQL (Apollo Client) — динамическое получение данных
Fetch API — взаимодействие с REST API для управления товарами
WebSocket API — реализация онлайн-чата
🛠 Бэкенд
Используемые технологии:

Node.js + Express.js — серверная логика
GraphQL (express-graphql) — API для запросов товаров
WebSocket (ws) — реализация двустороннего чата
CORS — разрешение кросс-доменных запросов
Body-parser — обработка JSON-запросов
Файловая система (fs) — хранение товаров в products.json
📡 API
🔷 GraphQL API (http://localhost:3000/graphql)
Запросы:

{ getAllProducts { id name price description category } } — получить все товары
{ getProductNamesAndPrices { name price } } — получить названия и цены
{ getCategories } — получить список категорий
🔶 REST API для админ-панели (http://localhost:8080/admin/products)
GET /admin/products — получить список товаров
POST /admin/products — добавить товар
PUT /admin/products/:id — редактировать товар
DELETE /admin/products/:id — удалить товар
📡 WebSocket API
ws://localhost:3000 — чат покупателя
ws://localhost:8080/admin — чат администратора
📁 Хранение данных
Все товары хранятся в backend-api/data/products.json.

🚀 Как запустить?
1️⃣ Установите зависимости

bash
Копировать
Редактировать
npm install
2️⃣ Запустите сервер GraphQL и WebSocket (порт 3000)

bash
Копировать
Редактировать
cd backend-api
node server.js
3️⃣ Запустите сервер админ-панели и WebSocket (порт 8080)

bash
Копировать
Редактировать
cd backend-admin
node server.js
4️⃣ Откройте в браузере

Клиент магазина: http://localhost:3000
Админ-панель: http://localhost:8080/admin
GraphQL API: http://localhost:3000/graphql
📌 Функционал
✔ Просмотр каталога товаров с фильтрацией
✔ Динамическая загрузка данных через GraphQL
✔ Админ-панель для управления товарами
✔ Онлайн-чат между пользователем и админом