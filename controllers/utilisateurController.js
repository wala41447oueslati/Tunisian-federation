const db = require("../database");

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

    let body = "";

    req.on("data", (chunk) => {
        body += chunk.toString();
    });

    req.on("end", () => {

        try {

            const data = JSON.parse(body);

            const {
                nom,
                prenom,
                email,
                telephone,
                date_naissance,
                adresse,
                photo
            } = data;

            // ==========================
            // Vérification des champs
            // ==========================

            if (!nom || !prenom || !email) {

                res.statusCode = 400;

                return res.end(JSON.stringify({
                    message: "nom, prenom et email sont obligatoires"
                }));
            }

            // ==========================
            // Vérifier si l'email existe
            // ==========================

            const checkEmailSql = `
                SELECT id
                FROM utilisateurs
                WHERE email = ?
            `;

            db.query(checkEmailSql, [email], (err, results) => {

                // Erreur base de données
                if (err) {

                    res.statusCode = 500;

                    return res.end(JSON.stringify({
                        message: "Erreur lors de la vérification de l'email",
                        error: err.message
                    }));
                }

                // L'email existe déjà
                if (results.length > 0) {

                    res.statusCode = 409;

                    return res.end(JSON.stringify({
                        message: "Cet email existe déjà"
                    }));
                }

                // ==========================
                // Créer l'utilisateur
                // ==========================

                const sql = `
                    INSERT INTO utilisateurs
                    (
                        nom,
                        prenom,
                        email,
                        telephone,
                        date_naissance,
                        adresse,
                        photo
                    )
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                `;

                const values = [
                    nom,
                    prenom,
                    email,
                    telephone || null,
                    date_naissance || null,
                    adresse || null,
                    photo || null
                ];

                db.query(sql, values, (err, result) => {

                    // Erreur lors de l'insertion
                    if (err) {

                        res.statusCode = 500;

                        return res.end(JSON.stringify({
                            message: "Erreur lors de la création",
                            error: err.message
                        }));
                    }

                    // Succès
                    res.statusCode = 201;

                    res.end(JSON.stringify({
                        message: "Utilisateur créé avec succès",

                        utilisateur: {
                            id: result.insertId,
                            nom,
                            prenom,
                            email,
                            telephone,
                            date_naissance,
                            adresse,
                            photo
                        }
                    }));
                });
            });

        } catch (error) {

            res.statusCode = 400;

            res.end(JSON.stringify({
                message: "JSON invalide"
            }));
        }
    });
}

module.exports = {
    getUtilisateurs,
    getUtilisateurById,
    createUtilisateur
};