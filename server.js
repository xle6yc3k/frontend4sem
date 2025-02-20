const http = require("http");
const fs = require("fs");
const path = require("path");

const server = http.createServer((req, res) => {
    let filePath = path.join(__dirname, req.url === "/" ? "index.html" : req.url);

    fs.readFile(filePath, (err, data) => {
        if (err) {
            fs.readFile("404.html", (error, errorPage) => {
                res.writeHead(404, { "Content-Type": "text/html" });
                res.end(errorPage);
            });
        } else {
            res.writeHead(200, { "Content-Type": "text/html" });
            res.end(data);
        }
    });
});

const PORT = 3000;
server.listen(PORT, () => console.log(`Сервер запущен на http://localhost:${PORT}`));
