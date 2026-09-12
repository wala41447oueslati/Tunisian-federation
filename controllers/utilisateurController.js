const db = require("../database");
const { formidable } = require("formidable");
const path = require("path");
const fs = require("fs");
const {genererDocumentInscription} = require("../services/inscriptionService");
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

    // ==========================================
    // DOSSIER UPLOADS
    // ==========================================

    const uploadDir = path.join(
        __dirname,
        "../uploads"
    );

    if (!fs.existsSync(uploadDir)) {

        fs.mkdirSync(uploadDir, {
            recursive: true
        });
    }


    // ==========================================
    // FORMIDABLE
    // ==========================================

    const form = formidable({
        uploadDir: uploadDir,
        keepExtensions: true,
        multiples: false
    });


    form.parse(req, async (err, fields, files) => {

        if (err) {

            res.statusCode = 400;

            return res.end(JSON.stringify({
                message: "Erreur lors de l'upload",
                error: err.message
            }));
        }


        // ==========================================
        // CHAMPS
        // ==========================================

        const nom = fields.nom?.[0];
        const prenom = fields.prenom?.[0];
        const dateNaiss = fields.dateNaiss?.[0];
        const category = fields.category?.[0];
        const adresse = fields.adresse?.[0];
        const grade = fields.grade?.[0];
        const clubName = fields.clubName?.[0];


        // ==========================================
        // PHOTO
        // ==========================================

        const photoFile = files.photo?.[0];

        let photoName = null;

        if (photoFile) {

            photoName =
                path.basename(photoFile.filepath);
        }


        // ==========================================
        // VALIDATION
        // ==========================================

        if (
            !nom ||
            !prenom ||
            !dateNaiss ||
            !category ||
            !adresse ||
            !grade ||
            !clubName
        ) {

            if (photoName) {

                const photoPath =
                    path.join(
                        uploadDir,
                        photoName
                    );

                if (fs.existsSync(photoPath)) {
                    fs.unlinkSync(photoPath);
                }
            }

            res.statusCode = 400;

            return res.end(JSON.stringify({
                message:
                    "Tous les champs obligatoires doivent être remplis"
            }));
        }


        // ==========================================
        // INSERTION MYSQL
        // ==========================================

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
            photoName
        ];


        db.query(
            sql,
            values,
            async (err, result) => {

                // ==========================================
                // ERREUR MYSQL
                // ==========================================

                if (err) {

                    if (photoName) {

                        const photoPath =
                            path.join(
                                uploadDir,
                                photoName
                            );

                        if (fs.existsSync(photoPath)) {
                            fs.unlinkSync(photoPath);
                        }
                    }

                    res.statusCode = 500;

                    return res.end(JSON.stringify({
                        message:
                            "Erreur lors de la création",
                        error: err.message
                    }));
                }


                // ==========================================
                // UTILISATEUR
                // ==========================================

                const utilisateur = {

                    id: result.insertId,

                    nom,
                    prenom,
                    dateNaiss,
                    category,
                    adresse,
                    grade,
                    clubName,

                    photo: photoName
                };


                // ==========================================
                // GENERATION DU PDF D'INSCRIPTION
                // ==========================================

                let documentInscription;

                try {

                    documentInscription =
                        await genererDocumentInscription(
                            utilisateur
                        );

                } catch (error) {

                    console.error(
                        "Erreur génération PDF inscription :",
                        error
                    );

                    res.statusCode = 500;

                    return res.end(JSON.stringify({
                        message:
                            "Utilisateur créé mais erreur lors de la génération du document d'inscription",
                        error: error.message
                    }));
                }


                // ==========================================
                // REPONSE
                // ==========================================

                res.statusCode = 201;

                res.setHeader(
                    "Content-Type",
                    "application/json; charset=utf-8"
                );


                res.end(JSON.stringify({

                    message:
                        "Utilisateur créé avec succès",

                    utilisateur: utilisateur,

                    documentInscription: {

                        nomFichier:
                            documentInscription.nomFichier,

                        cheminFichier:
                            documentInscription.cheminFichier
                    }

                }));
            }
        );
    });
}



module.exports = {
    getUtilisateurs,
    getUtilisateurById,
    createUtilisateur
};