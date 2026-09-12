const http = require("http");

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
        res.statusCode = 200;

        res.setHeader(
            "Content-Type",
            "application/json"
        );

        res.end(JSON.stringify({
            message:
                "Tunisian Federation API fonctionne !"
        }));

        return;
    }

    if (utilisateurRoutes(req, res)) {
        return;
    }

    if (carteRoutes(req, res)) {
        return;
    }

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