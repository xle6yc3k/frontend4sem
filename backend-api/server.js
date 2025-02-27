const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors());

app.use(express.static(path.join(__dirname, "../frontend")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

app.get("/products", (req, res) => {
    const data = fs.readFileSync(path.join(__dirname, "data/products.json"));
    res.json(JSON.parse(data));
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Сервер API работает на http://localhost:${PORT}`));
