const db = require("../database");
const { genererCarte } = require("../services/carteService");

function creerCarte(req, res, id) {

    const sql = "SELECT * FROM utilisateurs WHERE id = ?";

    db.query(sql, [id], async (err, results) => {

        if (err) {

            res.statusCode = 500;

            return res.end(JSON.stringify({
                message: "Erreur serveur",
                error: err.message
            }));
        }

        if (results.length === 0) {

            res.statusCode = 404;

            return res.end(JSON.stringify({
                message: "Utilisateur introuvable"
            }));
        }

        const utilisateur = results[0];

        try {

            const carte = await genererCarte(utilisateur);

            res.statusCode = 201;

            res.end(JSON.stringify({
                message: "Carte générée avec succès",
                carte: carte.nomFichier,
                chemin: carte.cheminFichier
            }));

        } catch (error) {

            res.statusCode = 500;

            res.end(JSON.stringify({
                message: "Erreur lors de la génération de la carte",
                error: error.message
            }));
        }
    });
}

module.exports = {
    creerCarte
};