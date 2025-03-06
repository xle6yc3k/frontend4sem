const express = require("express");
const cors = require("cors");
const fs = require("fs");
const bodyParser = require("body-parser");
const path = require("path");
const http = require("http");
const { WebSocketServer } = require("ws");

const app = express();
const PORT = 8080;

app.use(cors());
app.use(bodyParser.json());

const productsFile = path.join(__dirname, "../backend-api/data/products.json");

const getProducts = () => {
    if (!fs.existsSync(productsFile)) return [];
    const data = fs.readFileSync(productsFile);
    return JSON.parse(data);
};

const saveProducts = (products) => {
    fs.writeFileSync(productsFile, JSON.stringify(products, null, 2));
};

// 📌 Раздаём файлы для админки
app.use(express.static(path.join(__dirname, "../frontend")));

app.get("/admin", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/admin.html"));
});

app.get("/admin/products", (req, res) => {
    res.json(getProducts());
});

app.post("/admin/products", (req, res) => {
    const products = getProducts();
    const newProduct = req.body;
    newProduct.id = products.length + 1;
    products.push(newProduct);
    saveProducts(products);
    res.status(201).json({ message: "Товар добавлен", product: newProduct });
});

// 📌 WebSocket сервер для чата (общение между админом и пользователем)
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

let clients = {
    admin: null,
    users: []
};

wss.on("connection", (ws, req) => {
    console.log("🔌 Новое соединение WebSocket");
    
    const isAdmin = req.url.includes("/admin");
    
    if (isAdmin) {
        clients.admin = ws;
        console.log("🛠 Админ подключился");
    } else {
        clients.users.push(ws);
        console.log("👤 Новый пользователь подключился");
    }

    ws.on("message", (message) => {
        console.log(`📩 Получено сообщение: ${message}`);
        const msgData = JSON.parse(message);

        if (isAdmin) {
            // Если сообщение от админа – пересылаем всем пользователям
            clients.users.forEach(client => {
                if (client.readyState === ws.OPEN) {
                    client.send(JSON.stringify(msgData));
                }
            });
        } else {
            // Если сообщение от пользователя – пересылаем админу
            if (clients.admin && clients.admin.readyState === ws.OPEN) {
                clients.admin.send(JSON.stringify(msgData));
            }
        }
    });

    ws.on("close", () => {
        console.log("❌ Клиент отключился");
        if (isAdmin) {
            clients.admin = null;
        } else {
            clients.users = clients.users.filter(client => client !== ws);
        }
    });
});

// 📌 Запуск сервера
server.listen(PORT, () => {
    console.log(`🔹 Админ-панель работает на http://localhost:${PORT}/admin`);
    console.log(`🔹 WebSocket API: ws://localhost:${PORT}`);
});
