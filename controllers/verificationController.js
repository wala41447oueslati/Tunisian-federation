const db = require("../database");
const fs = require("fs");
const path = require("path");


function verifierUtilisateur(req, res, id) {

    const sql = `
        SELECT
            id,
            nom,
            prenom,
            dateNaiss,
            category,
            adresse,
            grade,
            clubName,
            photo
        FROM utilisateurs
        WHERE id = ?
    `;


    db.query(
        sql,
        [id],
        (err, results) => {

            

            if (err) {

                res.statusCode = 500;

                res.setHeader(
                    "Content-Type",
                    "text/html; charset=utf-8"
                );

                return res.end(`
                    <h1>Erreur serveur</h1>
                    <p>${err.message}</p>
                `);
            }


            if (results.length === 0) {

                res.statusCode = 404;

                res.setHeader(
                    "Content-Type",
                    "text/html; charset=utf-8"
                );

                return res.end(`
                    <h1>Licence introuvable</h1>
                    <p>Cette licence n'existe pas.</p>
                `);
            }


            const utilisateur =
                results[0];
            const dateFormatee = utilisateur.dateNaiss
                ? new Date(utilisateur.dateNaiss).toLocaleDateString("fr-FR")
                : "";

            



            res.statusCode = 200;

            res.setHeader(
                "Content-Type",
                "text/html; charset=utf-8"
            );


            res.end(`

                <!DOCTYPE html>

                <html lang="fr">

                <head>

                    <meta charset="UTF-8">

                    <meta
                        name="viewport"
                        content="width=device-width,
                        initial-scale=1.0"
                    >

                    <title>
                        Vérification de licence
                    </title>


                    <style>

                        * {
                            box-sizing: border-box;
                        }

                        body {
                            margin: 0;
                            padding: 20px;
                            font-family: Arial, sans-serif;
                            background: #f2f2f2;
                        }

                        .card {
                            max-width: 500px;
                            margin: auto;
                            background: white;
                            border-radius: 15px;
                            padding: 25px;
                            box-shadow:
                                0 4px 15px
                                rgba(0,0,0,0.15);
                        }

                        h1 {
                            text-align: center;
                            color: #123b6d;
                        }

                        .verified {
                            text-align: center;
                            color: green;
                            font-weight: bold;
                            margin-bottom: 20px;
                        }

                        .photo {
                            text-align: center;
                            margin-bottom: 20px;
                        }

                        .photo img {
                            width: 130px;
                            height: 150px;
                            object-fit: cover;
                            border-radius: 8px;
                        }

                        .info {
                            padding: 12px 0;
                            border-bottom:
                                1px solid #ddd;
                        }

                        .label {
                            font-weight: bold;
                            color: #555;
                        }

                    </style>

                </head>


                <body>

                    <div class="card">

                        <h1>
                            Fédération Tunisienne
                        </h1>

                        <div class="verified">
                            ✓ Licence vérifiée
                        </div>


                        


                        <div class="info">
                            <span class="label">
                                Numéro :
                            </span>

                            ${utilisateur.id}
                        </div>


                        <div class="info">
                            <span class="label">
                                Nom :
                            </span>

                            ${utilisateur.nom}
                        </div>


                        <div class="info">
                            <span class="label">
                                Prénom :
                            </span>

                            ${utilisateur.prenom}
                        </div>


                        <div class="info">
                            <span class="label">
                                Date de naissance :
                            </span>

                            ${dateFormatee}
                        </div>


                        <div class="info">
                            <span class="label">
                                Catégorie :
                            </span>

                            ${utilisateur.category || ""}
                        </div>


                        <div class="info">
                            <span class="label">
                                Adresse :
                            </span>

                            ${utilisateur.adresse || ""}
                        </div>


                        <div class="info">
                            <span class="label">
                                Grade :
                            </span>

                            ${utilisateur.grade || ""}
                        </div>


                        <div class="info">
                            <span class="label">
                                Club :
                            </span>

                            ${utilisateur.clubName || ""}
                        </div>

                    </div>

                </body>

                </html>

            `);
        }
    );
}


module.exports = {
    verifierUtilisateur
};