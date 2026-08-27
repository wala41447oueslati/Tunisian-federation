const { getUtilisateurs, getUtilisateurById, createUtilisateur} = require("../controllers/utilisateurController");

function utilisateurRoutes(req, res) {

    if (req.method === "POST" && req.url === "/utilisateurs") {
        createUtilisateur(req, res);
        return true;
    }

    
    if (req.method === "GET" && req.url === "/utilisateurs") {
        getUtilisateurs(req, res);
        return true;
    }

    if (
        req.method === "GET" &&
        req.url.startsWith("/utilisateurs/")
    ) {
        const id = req.url.split("/")[2];

        getUtilisateurById(req, res, id);
        return true;
    }

    return false;
}

module.exports = utilisateurRoutes;