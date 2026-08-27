const db = require("../database");
const { formidable } = require("formidable");
const path = require("path");
const fs = require("fs");
function getUtilisateurs(req, res) {

    const sql = "SELECT * FROM utilisateurs";

    db.query(sql, (err, results) => {

        if (err) {
            res.statusCode = 500;

            return res.end(JSON.stringify({
                message: "Erreur serveur",
                error: err.message
            }));
        }

        res.statusCode = 200;

        res.end(JSON.stringify({
            message: "Utilisateurs récupérés",
            utilisateurs: results
        }));
    });
}


function getUtilisateurById(req, res, id) {

    const sql = "SELECT * FROM utilisateurs WHERE id = ?";

    db.query(sql, [id], (err, results) => {

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

        res.statusCode = 200;

        res.end(JSON.stringify({
            message: "Utilisateur trouvé",
            utilisateur: results[0]
        }));
    });
}
function createUtilisateur(req, res) {

    const uploadDir = path.join(__dirname, "../uploads");

    // Créer le dossier uploads s'il n'existe pas
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }

    const form = formidable({
        uploadDir: uploadDir,
        keepExtensions: true,
        multiples: false
    });

    form.parse(req, (err, fields, files) => {

        if (err) {
            res.statusCode = 400;

            return res.end(JSON.stringify({
                message: "Erreur lors de l'upload",
                error: err.message
            }));
        }

        // Récupération des champs
        const nom = fields.nom?.[0];
        const prenom = fields.prenom?.[0];
        const dateNaiss = fields.dateNaiss?.[0];
        const category = fields.category?.[0];
        const adresse = fields.adresse?.[0];
        const grade = fields.grade?.[0];
        const clubName = fields.clubName?.[0];

        // Récupération de la photo
        const photoFile = files.photo?.[0];

        let photoPath = null;

        if (photoFile) {
            photoPath = photoFile.filepath;
        }

        // Vérification des champs obligatoires
        if (
            !nom ||
            !prenom ||
            !dateNaiss ||
            !category ||
            !adresse ||
            !grade ||
            !clubName
        ) {

            // Supprimer la photo si les données sont invalides
            if (photoPath && fs.existsSync(photoPath)) {
                fs.unlinkSync(photoPath);
            }

            res.statusCode = 400;

            return res.end(JSON.stringify({
                message: "Tous les champs obligatoires doivent être remplis"
            }));
        }

        // Requête SQL
        const sql = `
            INSERT INTO utilisateurs
            (
                nom,
                prenom,
                dateNaiss,
                category,
                adresse,
                grade,
                clubName,
                photo
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
            nom,
            prenom,
            dateNaiss,
            category,
            adresse,
            grade,
            clubName,
            photoPath
        ];

        db.query(sql, values, (err, result) => {

            if (err) {

                // Supprimer la photo si l'insertion échoue
                if (photoPath && fs.existsSync(photoPath)) {
                    fs.unlinkSync(photoPath);
                }

                res.statusCode = 500;

                return res.end(JSON.stringify({
                    message: "Erreur lors de la création",
                    error: err.message
                }));
            }

            res.statusCode = 201;

            res.end(JSON.stringify({

                message: "Utilisateur créé avec succès",

                utilisateur: {
                    id: result.insertId,
                    nom,
                    prenom,
                    dateNaiss,
                    category,
                    adresse,
                    grade,
                    clubName,
                    photo: photoPath
                }

            }));
        });
    });
}
module.exports = {
    getUtilisateurs,
    getUtilisateurById,
    createUtilisateur
};