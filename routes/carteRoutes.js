const { creerCarte } = require("../controllers/carteController");

function carteRoutes(req, res) {

    // POST /cartes/:id
    if (
        req.method === "POST" &&
        req.url.startsWith("/cartes/")
    ) {

        const id = req.url.split("/")[2];

        creerCarte(req, res, id);

        return true;
    }

    return false;
}

module.exports = carteRoutes;