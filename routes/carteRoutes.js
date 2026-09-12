const { creerCarte } = require("../controllers/carteController");
const fs = require("fs");
const path = require("path");

function carteRoutes(req, res) {

    console.log("CARTE ROUTE :", req.method, req.url);

    if (
        req.method === "POST" &&
        req.url.startsWith("/cartes/")
    ) {

        const id = req.url.split("/")[2];

        creerCarte(req, res, id);

        return true;
    }

    if (
        req.method === "GET" &&
        req.url.startsWith("/cartes/")
    ) {

        const filename = req.url.split("/")[2];

        const filePath = path.join(
            __dirname,
            "../cartes",
            filename
        );

        console.log("Recherche :", filePath);

        if (!fs.existsSync(filePath)) {

            res.statusCode = 404;

            res.setHeader(
                "Content-Type",
                "application/json"
            );

            res.end(JSON.stringify({
                message: "Carte introuvable"
            }));

            return true;
        }

        res.statusCode = 200;

        res.setHeader(
            "Content-Type",
            "application/pdf"
        );

        const file = fs.createReadStream(filePath);

        file.pipe(res);

        return true;
    }

    return false;
}

module.exports = carteRoutes;