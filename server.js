const http = require("http");

const utilisateurRoutes = require("./routes/utilisateurRoutes");

const carteRoutes = require("./routes/carteRoutes");


const server = http.createServer((req, res) => {

    res.setHeader("Content-Type", "application/json");

    console.log(req.method, req.url);


    const utilisateurRoute = utilisateurRoutes(req, res);

    if (utilisateurRoute) {
        return;
    }


    const carteRoute =carteRoutes(req, res);

    if (carteRoute) {
        return;
    }

    res.statusCode = 404;

    res.end(JSON.stringify({
        message: "Route introuvable"
    }));
});


server.listen(3000, () => {

    console.log(
        "Serveur démarré sur http://localhost:3000"
    );

});