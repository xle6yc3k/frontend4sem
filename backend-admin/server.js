const express = require("express");
const cors = require("cors");
const fs = require("fs");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = 8080;

// Загружаем товары из JSON
const getProducts = () => JSON.parse(fs.readFileSync("../backend-api/data/products.json"));

// Сохраняем товары
const saveProducts = (products) => fs.writeFileSync("../backend-api/data/products.json", JSON.stringify(products, null, 2));

// Добавление товаров
app.post("/admin/products", (req, res) => {
    const products = getProducts();
    const newProduct = req.body;
    newProduct.id = products.length + 1;
    products.push(newProduct);
    saveProducts(products);
    res.status(201).json({ message: "Товар добавлен", product: newProduct });
});

// Редактирование товара по ID
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

// Удаление товара по ID
app.delete("/admin/products/:id", (req, res) => {
    let products = getProducts();
    const id = parseInt(req.params.id);
    products = products.filter(p => p.id !== id);
    saveProducts(products);
    res.json({ message: "Товар удалён" });
});

app.listen(PORT, () => console.log(`Сервер админки работает на порту ${PORT}`));
