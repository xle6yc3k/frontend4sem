const express = require("express");
const cors = require("cors");
const fs = require("fs");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const PORT = 8080;

app.use(cors());
app.use(bodyParser.json());

const productsFile = path.join(__dirname, "../backend-api/data/products.json");

// 📌 Функция загрузки товаров
const getProducts = () => {
    if (!fs.existsSync(productsFile)) return [];
    const data = fs.readFileSync(productsFile);
    return JSON.parse(data);
};

// 📌 Функция сохранения товаров
const saveProducts = (products) => {
    fs.writeFileSync(productsFile, JSON.stringify(products, null, 2));
};

// 📌 Раздача статических файлов админки
app.use(express.static(path.join(__dirname, "../frontend")));

// 📌 Открываем `admin.html` при запросе `/admin`
app.get("/admin", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/admin.html"));
});

// 📌 Получение всех товаров
app.get("/admin/products", (req, res) => {
    res.json(getProducts());
});

// 📌 Добавление одного или нескольких товаров
app.post("/admin/products", (req, res) => {
    const products = getProducts();
    const newProducts = req.body;

    if (Array.isArray(newProducts)) {
        newProducts.forEach(product => {
            product.id = products.length + 1;
            products.push(product);
        });
    } else {
        newProducts.id = products.length + 1;
        products.push(newProducts);
    }

    saveProducts(products);
    res.status(201).json({ message: "Товары добавлены", products: newProducts });
});

// 📌 Редактирование товара по ID
app.put("/admin/products/:id", (req, res) => {
    const products = getProducts();
    const id = parseInt(req.params.id);
    const index = products.findIndex(p => p.id === id);

    if (index !== -1) {
        products[index] = { ...products[index], ...req.body };
        saveProducts(products);
        res.json({ message: "Товар обновлён", product: products[index] });
    } else {
        res.status(404).json({ message: "Товар не найден" });
    }
});

// 📌 Удаление товара по ID
app.delete("/admin/products/:id", (req, res) => {
    let products = getProducts();
    const id = parseInt(req.params.id);
    const filteredProducts = products.filter(p => p.id !== id);

    if (filteredProducts.length !== products.length) {
        saveProducts(filteredProducts);
        res.json({ message: "Товар удалён" });
    } else {
        res.status(404).json({ message: "Товар не найден" });
    }
});

// 📌 Запуск сервера
app.listen(PORT, () => console.log(`Админ-панель работает на http://localhost:${PORT}/admin`));
