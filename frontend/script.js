const API_URL =
    "https://tunisian-federation-production.up.railway.app";

const form =
    document.getElementById("inscriptionForm");

const submitButton =
    document.getElementById("submitButton");

const message =
    document.getElementById("message");

const downloadSection =
    document.getElementById("downloadSection");

const downloadLink =
    document.getElementById("downloadLink");


form.addEventListener("submit", async function (event) {

    event.preventDefault();

    submitButton.disabled = true;

    message.textContent =
        "⏳ Inscription en cours...";

    downloadSection.style.display = "none";


    try {

        // =========================
        // 1. Récupérer les données
        // =========================

        const formData = new FormData();

        formData.append(
            "nom",
            document.getElementById("nom").value
        );

        formData.append(
            "prenom",
            document.getElementById("prenom").value
        );

        formData.append(
            "dateNaiss",
            document.getElementById("dateNaiss").value
        );

        formData.append(
            "category",
            document.getElementById("category").value
        );

        formData.append(
            "adresse",
            document.getElementById("adresse").value
        );

        formData.append(
            "grade",
            document.getElementById("grade").value
        );

        formData.append(
            "clubName",
            document.getElementById("clubName").value
        );


        const photo =
            document.getElementById("photo").files[0];

        formData.append(
            "photo",
            photo
        );


        // =========================
        // 2. Créer l'utilisateur
        // =========================

        message.textContent =
            "⏳ Création de votre inscription...";


        const inscriptionResponse =
            await fetch(
                `${API_URL}/utilisateurs`,
                {
                    method: "POST",
                    body: formData
                }
            );


        if (!inscriptionResponse.ok) {

            const error =
                await inscriptionResponse.text();

            throw new Error(
                `Erreur inscription : ${error}`
            );
        }


        const utilisateur =
            await inscriptionResponse.json();


        console.log(
            "Utilisateur créé :",
            utilisateur
        );


        // =========================
        // 3. Récupérer l'ID
        // =========================

        const id =
            utilisateur.utilisateur.id;


        if (!id) {

            throw new Error(
                "L'API n'a pas retourné l'ID de l'utilisateur."
            );
        }


        // =========================
        // 4. Générer la carte
        // =========================

        message.textContent =
            "⏳ Génération de votre carte...";


        const carteResponse =
            await fetch(
                `${API_URL}/cartes/${id}`,
                {
                    method: "POST"
                }
            );

        console.log("Status carte :", carteResponse.status);
        console.log("Content-Type :", carteResponse.headers.get("content-type"));
        if (!carteResponse.ok) {

            const error =
                await carteResponse.text();

            throw new Error(
                `Erreur génération carte : ${error}`
            );
        }


        // =========================
        // 5. Récupérer le PDF
        // =========================

        const pdfBlob =
            await carteResponse.blob();

        console.log("PDF Blob :", pdfBlob);
        console.log("Taille :", pdfBlob.size);
        console.log("Type :", pdfBlob.type);


        const pdfUrl =
            URL.createObjectURL(pdfBlob);


        // =========================
        // 6. Afficher le téléchargement
        // =========================

        downloadLink.href =
            pdfUrl;

        downloadLink.download =
            `carte_${id}.pdf`;

        downloadSection.style.display =
            "block";


        message.textContent =
            "✅ Inscription réussie ! Votre carte est prête.";


        // =========================
        // 7. Télécharger automatiquement
        // =========================

        const link =
            document.createElement("a");

        link.href =
            pdfUrl;

        link.download =
            `carte_${id}.pdf`;

        document.body.appendChild(link);

        link.click();

        link.remove();


    } catch (error) {

        console.error(error);

        message.textContent =
            "❌ Une erreur est survenue : " +
            error.message;


    } finally {

        submitButton.disabled = false;
    }

});