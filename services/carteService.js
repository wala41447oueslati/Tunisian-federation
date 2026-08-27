const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

function genererCarte(utilisateur) {

    return new Promise((resolve, reject) => {

        const dossierCartes = path.join(__dirname, "../cartes");

        if (!fs.existsSync(dossierCartes)) {
            fs.mkdirSync(dossierCartes);
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
            .rect(0, 0, 500, 70)
            .fill("#1E3A5F");

        doc
            .fillColor("white")
            .fontSize(22)
            .font("Helvetica-Bold")
            .text(
                "CARTE D'IDENTIFICATION",
                20,
                23,
                {
                    width: 460,
                    align: "center"
                }
            );

        
        doc
            .rect(30, 100, 100, 120)
            .stroke("#333333");

        if (utilisateur.photo &&fs.existsSync(utilisateur.photo))
        {

            doc.image(
                utilisateur.photo,
                30,
                100,
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
                    30,
                    150,
                    {
                        width: 100,
                        align: "center"
                    }
                );
        }

        

        doc
            .fillColor("#000000")
            .fontSize(14)
            .font("Helvetica-Bold");

        doc.text(
            `${utilisateur.prenom} ${utilisateur.nom}`,
            160,
            105
        );

        doc
            .fontSize(12)
            .font("Helvetica");

        doc.text(
            `ID : ${utilisateur.id}`,
            160,
            140
        );

        doc.text(
            `Email : ${utilisateur.email}`,
            160,
            165
        );

        doc.text(
            `Téléphone : ${utilisateur.telephone || "Non renseigné"}`,
            160,
            190
        );

       
        doc
            .rect(0, 260, 500, 40)
            .fill("#1E3A5F");

        doc
            .fillColor("white")
            .fontSize(10)
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