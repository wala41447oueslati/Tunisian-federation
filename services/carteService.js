const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const { genererQRCode } = require("./qrService");

async function genererCarte(utilisateur) {

    return new Promise(async (resolve, reject) => {

        try {

            const dossierCartes = path.join(
                __dirname,
                "../cartes"
            );

            if (!fs.existsSync(dossierCartes)) {
                fs.mkdirSync(dossierCartes, {
                    recursive: true
                });
            }


            let photoPath = null;

            if (utilisateur.photo) {

                photoPath = path.join(
                    __dirname,
                    "../uploads",
                    utilisateur.photo
                );

                console.log("PHOTO DATABASE :", utilisateur.photo);
                console.log("PHOTO PATH :", photoPath);
                console.log(
                    "PHOTO EXISTS :",
                    photoPath ? fs.existsSync(photoPath) : false
                );
            }

            const qrPath = await genererQRCode(
                utilisateur.id,
                dossierCartes
            );


            const nomFichier =
                `carte_${utilisateur.id}.pdf`;

            const cheminFichier = path.join(
                dossierCartes,
                nomFichier
            );

            const doc = new PDFDocument({
                size: [370, 232],
                margin: 0
            });

            const stream = fs.createWriteStream(
                cheminFichier
            );

            doc.pipe(stream);



            doc
                .rect(0, 0, 370, 232)
                .fill("#F4F4F4");


            doc
                .rect(0, 0, 370, 48)
                .fill("#FFFFFF");
                
            const tunisieLogoPath = path.join(
                __dirname,
                "../assets/Tunisia.png"
            );

            const federationLogoPath = path.join(
                __dirname,
                "../assets/federation.png"
            );



            if (fs.existsSync(tunisieLogoPath)) {

                doc.image(
                    tunisieLogoPath,
                    8,
                    10,
                    {
                        width: 32,
                        height: 25
                    }
                );
            }



            doc
                .fillColor("#555555")
                .font("Helvetica-Bold")
                .fontSize(6.5)
                .text(
                    "République Tunisienne",
                    45,
                    10,
                    {
                        width: 105
                    }
                );



            doc
                .font("Helvetica")
                .fontSize(5.5)
                .fillColor("#666666")
                .text(
                    "Ministère des affaires",
                    45,
                    20,
                    {
                        width: 105
                    }
                );



            doc
                .font("Helvetica")
                .fontSize(5.5)
                .text(
                    "de la jeunesse et des sports",
                    45,
                    28,
                    {
                        width: 110
                    }
                );


            if (fs.existsSync(federationLogoPath)) {

                doc.image(
                    federationLogoPath,
                    245,
                    6,
                    {
                        width: 40,
                        height: 38
                    }
                );
            }


            doc
                .font("Helvetica")
                .fontSize(6.5)
                .fillColor("#555555")
                .text(
                    "Tunisian",
                    290,
                    8,
                    {
                        width: 70
                    }
                );

            doc
                .font("Helvetica")
                .fontSize(6.5)
                .text(
                    "Taekwondo",
                    290,
                    18,
                    {
                        width: 70
                    }
                );

            doc
                .font("Helvetica")
                .fontSize(6.5)
                .text(
                    "Federation",
                    290,
                    28,
                    {
                        width: 70
                    }
           );



            const photoX = 18;
            const photoY = 58;
            const photoWidth = 90;
            const photoHeight = 110;

            doc
                .rect(
                    photoX,
                    photoY,
                    photoWidth,
                    photoHeight
                )
                .stroke("#CCCCCC");


            if (
                photoPath &&
                fs.existsSync(photoPath)
            ) {

                doc.image(
                    photoPath,
                    photoX,
                    photoY,
                    {
                        width: photoWidth,
                        height: photoHeight
                    }
                );

            } else {

                doc
                    .fillColor("#888888")
                    .font("Helvetica")
                    .fontSize(10)
                    .text(
                        "PHOTO",
                        photoX,
                        105,
                        {
                            width: photoWidth,
                            align: "center"
                        }
                    );
            }


            const infoX = 120;



            doc
                .fillColor("#222222")
                .font("Helvetica-Bold")
                .fontSize(12)
                .text(
                    `${utilisateur.prenom || ""} ${utilisateur.nom || ""}`,
                    infoX,
                    60,
                    {
                        width: 145
                    }
                );


            let dateFormatee = "";

            if (utilisateur.dateNaiss) {

                dateFormatee =
                    new Date(utilisateur.dateNaiss)
                        .toLocaleDateString("fr-FR");
            }

            doc
                .font("Helvetica")
                .fontSize(8)
                .fillColor("#222222")
                .text(
                    `Date de naissance : ${dateFormatee}`,
                    infoX,
                    92,
                    {
                        width: 150
                    }
                );


            doc.text(
                `Catégorie : ${utilisateur.category || ""}`,
                infoX,
                110,
                {
                    width: 150
                }
            );


            doc.text(
                `Grade : ${utilisateur.grade || ""}`,
                infoX,
                128,
                {
                    width: 150
                }
            );



            doc.text(
                `Adresse : ${utilisateur.adresse || ""}`,
                infoX,
                146,
                {
                    width: 150
                }
            );


            doc.text(
                `Club : ${utilisateur.clubName || ""}`,
                infoX,
                164,
                {
                    width: 150
                }
            );



            doc.image(
                qrPath,
                280,
                55,
                {
                    width: 65,
                    height: 65
                }
            );



            doc
                .font("Helvetica-Bold")
                .fontSize(8)
                .fillColor("#333333")
                .text(
                    `N° : ${utilisateur.id}`,
                    275,
                    125,
                    {
                        width: 75,
                        align: "center"
                    }
                );


            doc
                .rect(
                    0,
                    198,
                    370,
                    34
                )
                .fill("#0878C9");


            doc
                .fillColor("#FFFFFF")
                .font("Helvetica-Bold")
                .fontSize(20)
                .text(
                    "ATHLETE",
                    18,
                    205
                );


            doc.end();


            stream.on(
                "finish",
                () => {


                    if (
                        qrPath &&
                        fs.existsSync(qrPath)
                    ) {

                        fs.unlinkSync(qrPath);
                    }


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
    genererCarte
};
