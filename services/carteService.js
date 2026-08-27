const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

function genererCarte(utilisateur) {

    return new Promise((resolve, reject) => {

        const dossierCartes = path.join(__dirname, "../cartes");

        if (!fs.existsSync(dossierCartes)) {
            fs.mkdirSync(dossierCartes, { recursive: true });
        }

        const nomFichier = `carte_${utilisateur.id}.pdf`;

        const cheminFichier = path.join(
            dossierCartes,
            nomFichier
        );

        const doc = new PDFDocument({
            size: [500, 300],
            margin: 0
        });

        const stream = fs.createWriteStream(cheminFichier);

        doc.pipe(stream);


        doc
            .rect(0, 0, 500, 300)
            .fill("#F5F5F5");


        doc
            .rect(0, 0, 500, 65)
            .fill("#1E3A5F");

        doc
            .fillColor("white")
            .fontSize(21)
            .font("Helvetica-Bold")
            .text(
                "CARTE D'IDENTIFICATION",
                20,
                21,
                {
                    width: 460,
                    align: "center"
                }
            );


        doc
            .rect(25, 85, 100, 120)
            .stroke("#333333");

        if (
            utilisateur.photo &&
            fs.existsSync(utilisateur.photo)
        ) {

            doc.image(
                utilisateur.photo,
                25,
                85,
                {
                    width: 100,
                    height: 120
                }
            );

        } else {

            doc
                .fillColor("#777777")
                .fontSize(12)
                .font("Helvetica")
                .text(
                    "PHOTO",
                    25,
                    138,
                    {
                        width: 100,
                        align: "center"
                    }
                );
        }


        doc
            .fillColor("#000000")
            .fontSize(15)
            .font("Helvetica-Bold")
            .text(
                `${utilisateur.prenom} ${utilisateur.nom}`,
                145,
                82,
                {
                    width: 330
                }
            );


        doc
            .fontSize(10)
            .font("Helvetica");

        doc.text(
            `N: ${utilisateur.id}`,
            145,
            112
        );

        const dateFormatee = new Date(utilisateur.dateNaiss)
            .toLocaleDateString("fr-FR");

        doc.text(
            `${dateFormatee}`,
            145,
            132
        );

        doc.text(
            `${utilisateur.category}`,
            145,
            152
        );

        doc.text(
            `${utilisateur.grade}`,
            145,
            172
        );

        doc.text(
            `${utilisateur.adresse}`,
            145,
            192,
            {
                width: 320
            }
        );

        doc.text(
            `${utilisateur.clubName}`,
            145,
            212,
            {
                width: 320
            }
        );


        doc
            .rect(0, 260, 500, 40)
            .fill("#1E3A5F");

        doc
            .fillColor("white")
            .fontSize(10)
            .font("Helvetica")
            .text(
                "Carte générée automatiquement",
                0,
                275,
                {
                    width: 500,
                    align: "center"
                }
            );


        doc.end();

        stream.on("finish", () => {

            resolve({
                nomFichier,
                cheminFichier
            });

        });

        stream.on("error", (error) => {
            reject(error);
        });

    });
}

module.exports = {
    genererCarte
};