const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");
const { WebSocketServer } = require("ws");
const http = require("http");

const app = express();
app.use(cors());

// 📌 Раздаём статику (HTML, CSS, JS)
const frontendPath = path.resolve(__dirname, "../frontend");
app.use(express.static(frontendPath));

// 📌 GraphQL API
const productsFile = path.join(__dirname, "data/products.json");

const getProducts = () => JSON.parse(fs.readFileSync(productsFile));

const schema = buildSchema(`
    type Product {
        id: Int
        name: String
        price: Int
        description: String
        category: [String]
    }

    type Query {
        getAllProducts: [Product]
        getProductById(id: Int!): Product
        getProductNamesAndPrices: [Product]
        getCategories: [String]
    }
`);

const root = {
    getAllProducts: () => getProducts(),
    getProductById: ({ id }) => getProducts().find(p => p.id === id),
    getProductNamesAndPrices: () => getProducts().map(({ id, name, price }) => ({ id, name, price })),
    getCategories: () => [...new Set(getProducts().flatMap(p => p.category))] // Уникальные категории
};

app.use("/graphql", graphqlHTTP({
    schema,
    rootValue: root,
    graphiql: true
}));

// 📌 Главная страница
app.get("/", (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
});

// 📌 Создаём HTTP-сервер, к которому привяжем WebSocket
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

let clients = [];

wss.on("connection", (ws) => {
    console.log("🔌 Новое соединение WebSocket");
    clients.push(ws);

    ws.on("message", (message) => {
        console.log(`📩 Получено сообщение: ${message}`);
        
        // Рассылаем сообщение всем клиентам
        clients.forEach(client => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });

    ws.on("close", () => {
        console.log("❌ Клиент отключился");
        clients = clients.filter(client => client !== ws);
    });
});

// 📌 Запускаем сервер и WebSocket на одном порту
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Сервер работает на:
🔹 GraphQL API: http://localhost:${PORT}/graphql
🔹 WebSocket API: ws://localhost:${PORT}`);
});
