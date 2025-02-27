const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
app.use(cors());

const PORT = 3000;

// Загружаем товары из JSON
const getProducts = () => {
    const data = fs.readFileSync("data/products.json");
    return JSON.parse(data);
};

// API для получения всех товаров
app.get("/products", (req, res) => {
    res.json(getProducts());
});

// API для получения товаров по категории
app.get("/products/category/:category", (req, res) => {
    const category = req.params.category;
    const products = getProducts().filter(p => p.category.includes(category));
    res.json(products);
});

app.listen(PORT, () => console.log(`Сервер API работает на порту ${PORT}`));
