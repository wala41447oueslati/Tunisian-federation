const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

function genererDocumentInscription(utilisateur) {

    return new Promise((resolve, reject) => {

        try {


            const dossierInscriptions = path.join(
                __dirname,
                "../inscriptions"
            );

            if (!fs.existsSync(dossierInscriptions)) {
                fs.mkdirSync(dossierInscriptions, {
                    recursive: true
                });
            }



            const nomFichier =
                `inscription_${utilisateur.id}.pdf`;

            const cheminFichier =
                path.join(
                    dossierInscriptions,
                    nomFichier
                );


            const doc = new PDFDocument({
                size: "A4",
                margin: 50
            });

            const stream =
                fs.createWriteStream(
                    cheminFichier
                );

            doc.pipe(stream);

            const logoPath =
                path.join(
                    __dirname,
                    "../assets/federation.png"
                );

            if (fs.existsSync(logoPath)) {

                doc.image(
                    logoPath,
                    50,
                    40,
                    {
                        width: 100,
                        height: 70
                    }
                );
            }

            doc
                .fillColor("#123B6D")
                .font("Helvetica-Bold")
                .fontSize(22)
                .text(
                    "FÉDÉRATION TUNISIENNE",
                    170,
                    55,
                    {
                        width: 370,
                        align: "center"
                    }
                );


            doc
                .fillColor("#555555")
                .font("Helvetica")
                .fontSize(11)
                .text(
                    "Document officiel d'inscription",
                    170,
                    85,
                    {
                        width: 370,
                        align: "center"
                    }
                );

            doc
                .moveTo(50, 130)
                .lineTo(545, 130)
                .stroke("#123B6D");

            doc
                .fillColor("#123B6D")
                .font("Helvetica-Bold")
                .fontSize(24)
                .text(
                    "Félicitations !",
                    50,
                    160,
                    {
                        width: 495,
                        align: "center"
                    }
                );


            doc
                .fillColor("#333333")
                .font("Helvetica")
                .fontSize(13)
                .text(
                    "Votre inscription auprès de la Fédération Tunisienne " +
                    "a été enregistrée avec succès.",
                    80,
                    210,
                    {
                        width: 435,
                        align: "center",
                        lineGap: 6
                    }
                );


            doc
                .text(
                    "Nous vous souhaitons beaucoup de succès " +
                    "dans votre parcours sportif.",
                    80,
                    250,
                    {
                        width: 435,
                        align: "center",
                        lineGap: 6
                    }
                );


            doc
                .fillColor("#123B6D")
                .font("Helvetica-Bold")
                .fontSize(17)
                .text(
                    "Coordonnées de l'athlète",
                    50,
                    315,
                    {
                        width: 495,
                        align: "center"
                    }
                );



            const dateFormatee =
                utilisateur.dateNaiss
                    ? new Date(
                        utilisateur.dateNaiss
                    ).toLocaleDateString("fr-FR")
                    : "";



            const informations = [

                [
                    "Numéro",
                    utilisateur.id
                ],

                [
                    "Nom",
                    utilisateur.nom || ""
                ],

                [
                    "Prénom",
                    utilisateur.prenom || ""
                ],

                [
                    "Date de naissance",
                    dateFormatee
                ],

                [
                    "Catégorie",
                    utilisateur.category || ""
                ],

                [
                    "Adresse",
                    utilisateur.adresse || ""
                ],

                [
                    "Grade",
                    utilisateur.grade || ""
                ],

                [
                    "Club",
                    utilisateur.clubName || ""
                ]

            ];


            let y = 360;


            informations.forEach(
                ([label, valeur]) => {

                    doc
                        .roundedRect(
                            70,
                            y - 5,
                            455,
                            28,
                            4
                        )
                        .fill("#F4F6F8");


                    doc
                        .fillColor("#555555")
                        .font("Helvetica-Bold")
                        .fontSize(11)
                        .text(
                            label,
                            90,
                            y + 3,
                            {
                                width: 150
                            }
                        );


                    doc
                        .fillColor("#222222")
                        .font("Helvetica")
                        .fontSize(11)
                        .text(
                            `${valeur}`,
                            250,
                            y + 3,
                            {
                                width: 250
                            }
                        );


                    y += 35;
                }
            );



            doc
                .moveTo(50, 690)
                .lineTo(545, 690)
                .stroke("#CCCCCC");


            doc
                .fillColor("#777777")
                .font("Helvetica")
                .fontSize(9)
                .text(
                    "Ce document a été généré automatiquement " +
                    "lors de l'inscription.",
                    50,
                    710,
                    {
                        width: 495,
                        align: "center"
                    }
                );



            doc.end();


            stream.on(
                "finish",
                () => {

                    resolve({
                        nomFichier,
                        cheminFichier
                    });

                }
            );


            stream.on(
                "error",
                (error) => {

                    reject(error);

                }
            );


        } catch (error) {

            reject(error);

        }

    });
}


module.exports = {
    genererDocumentInscription
};
