const {
    getUtilisateurs,
    getUtilisateurById,
    createUtilisateur
} = require("../controllers/utilisateurController");

const fs = require("fs");
const path = require("path");

function utilisateurRoutes(req, res) {

    // ==========================================
    // POST /utilisateurs
    // ==========================================

    if (
        req.method === "POST" &&
        req.url === "/utilisateurs"
    ) {
        createUtilisateur(req, res);
        return true;
    }


    // ==========================================
    // GET /utilisateurs
    // ==========================================

    if (
        req.method === "GET" &&
        req.url === "/utilisateurs"
    ) {
        getUtilisateurs(req, res);
        return true;
    }


    // ==========================================
    // GET /utilisateurs/:id
    // ==========================================

    if (
        req.method === "GET" &&
        req.url.startsWith("/utilisateurs/")
    ) {
        const id = req.url.split("/")[2];

        getUtilisateurById(req, res, id);
        return true;
    }


    // ==========================================
    // GET /inscriptions/:filename
    // ==========================================

    if (
        req.method === "GET" &&
        req.url.startsWith("/inscriptions/")
    ) {

        const filename =
            req.url.split("/")[2];

        const filePath = path.join(
            __dirname,
            "../inscriptions",
            filename
        );

        console.log(
            "Recherche inscription :",
            filePath
        );


        if (!fs.existsSync(filePath)) {

            res.statusCode = 404;

            res.setHeader(
                "Content-Type",
                "application/json"
            );

            res.end(JSON.stringify({
                message:
                    "Document d'inscription introuvable"
            }));

            return true;
        }


        res.statusCode = 200;

        res.setHeader(
            "Content-Type",
            "application/pdf"
        );

        res.setHeader(
            "Content-Disposition",
            `attachment; filename="${filename}"`
        );


        const file =
            fs.createReadStream(filePath);

        file.pipe(res);

        return true;
    }


    return false;
}

module.exports = utilisateurRoutes;