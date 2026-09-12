const http = require("http");
const fs = require("fs");
const path = require("path");
const utilisateurRoutes =
    require("./routes/utilisateurRoutes");

const carteRoutes =
    require("./routes/carteRoutes");

const verificationRoutes =
    require("./routes/verificationRoutes");

const server = http.createServer((req, res) => {

    console.log(req.method, req.url);

    if (
        req.url === "/" &&
        req.method === "GET"
    ) {
        const filePath = path.join(
            __dirname,
            "frontend",
            "index.html"
        );

        res.statusCode = 200;
        res.setHeader(
            "Content-Type",
            "text/html; charset=utf-8"
        );

        fs.createReadStream(filePath).pipe(res);

        return;
    }
    if (
        req.method === "GET" &&
        req.url === "/style.css"
    ) {
        const filePath = path.join(
            __dirname,
            "frontend",
            "style.css"
        );

        res.statusCode = 200;
        res.setHeader(
            "Content-Type",
            "text/css"
        );

        fs.createReadStream(filePath).pipe(res);

        return;
    }

    if (
        req.method === "GET" &&
        req.url === "/script.js"
    ) {
        const filePath = path.join(
            __dirname,
            "frontend",
            "script.js"
        );

        res.statusCode = 200;
        res.setHeader(
            "Content-Type",
            "application/javascript"
        );

        fs.createReadStream(filePath).pipe(res);

        return;
    }

    if (utilisateurRoutes(req, res)) {
        return;
    }

    console.log("AVANT CARTE ROUTE");

    if (carteRoutes(req, res)) {
        console.log("CARTE ROUTE A REPONDU");
        return;
    }

    console.log("CARTE ROUTE N'A PAS REPONDU");

    if (verificationRoutes(req, res)) {
        return;
    }

    res.statusCode = 404;

    res.setHeader(
        "Content-Type",
        "application/json"
    );

    res.end(JSON.stringify({
        message: "Route introuvable"
    }));
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, "0.0.0.0", () => {
    console.log(
        `Serveur démarré sur le port ${PORT}`
    );
});