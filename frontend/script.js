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
        "⏳ Création de votre inscription...";

    downloadSection.style.display = "none";


    try {

        // ==========================================
        // 1. Préparer les données
        // ==========================================

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


        // ==========================================
        // 2. Créer l'utilisateur
        // ==========================================

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


        const resultat =
            await inscriptionResponse.json();


        console.log(
            "Utilisateur créé :",
            resultat
        );


        // ==========================================
        // 3. Récupérer ID
        // ==========================================

        const id =
            resultat.utilisateur.id;


        if (!id) {

            throw new Error(
                "L'API n'a pas retourné l'ID de l'utilisateur."
            );
        }


        // ==========================================
        // 4. Récupérer le PDF d'inscription
        // ==========================================

        const nomFichier =
            resultat.documentInscription.nomFichier;


        if (!nomFichier) {

            throw new Error(
                "Le document d'inscription n'a pas été généré."
            );
        }


        message.textContent =
            "⏳ Téléchargement de votre document d'inscription...";


        const inscriptionPdfResponse =
            await fetch(
                `${API_URL}/inscriptions/${nomFichier}`
            );


        if (!inscriptionPdfResponse.ok) {

            const error =
                await inscriptionPdfResponse.text();

            throw new Error(
                `Erreur document d'inscription : ${error}`
            );
        }


        const inscriptionBlob =
            await inscriptionPdfResponse.blob();


        const inscriptionUrl =
            URL.createObjectURL(inscriptionBlob);


        // ==========================================
        // 5. Télécharger le document d'inscription
        // ==========================================

        const link =
            document.createElement("a");

        link.href =
            inscriptionUrl;

        link.download =
            nomFichier;

        document.body.appendChild(link);

        link.click();

        link.remove();


        // ==========================================
        // 6. Afficher la page bienvenue
        // ==========================================

        form.style.display = "none";


        message.innerHTML = `
            <h2>🎉 Bienvenue !</h2>

            <p>
                Votre inscription a été enregistrée
                avec succès.
            </p>

            <p>
                Votre document d'inscription
                a été téléchargé.
            </p>

            <button
                type="button"
                id="generateCardButton"
            >
                Générer ma carte
            </button>
        `;


        // ==========================================
        // 7. Bouton génération carte
        // ==========================================

        const generateCardButton =
            document.getElementById(
                "generateCardButton"
            );


        generateCardButton.addEventListener(
            "click",
            async function () {

                generateCardButton.disabled = true;

                generateCardButton.textContent =
                    "⏳ Génération de la carte...";


                try {

                    // ==========================================
                    // POST /cartes/:id
                    // ==========================================

                    const carteResponse =
                        await fetch(
                            `${API_URL}/cartes/${id}`,
                            {
                                method: "POST"
                            }
                        );


                    if (!carteResponse.ok) {

                        const error =
                            await carteResponse.text();

                        throw new Error(
                            `Erreur génération carte : ${error}`
                        );
                    }


                    // ==========================================
                    // Récupérer le PDF
                    // ==========================================

                    const pdfBlob =
                        await carteResponse.blob();


                    const pdfUrl =
                        URL.createObjectURL(pdfBlob);


                    // ==========================================
                    // Télécharger la carte
                    // ==========================================

                    const cardLink =
                        document.createElement("a");

                    cardLink.href =
                        pdfUrl;

                    cardLink.download =
                        `carte_${id}.pdf`;

                    document.body.appendChild(
                        cardLink
                    );

                    cardLink.click();

                    cardLink.remove();


                    generateCardButton.textContent =
                        "✅ Carte téléchargée";


                } catch (error) {

                    console.error(error);

                    generateCardButton.disabled =
                        false;

                    generateCardButton.textContent =
                        "Générer ma carte";

                    message.innerHTML += `
                        <p>
                            ❌ ${error.message}
                        </p>
                    `;
                }

            }
        );


    } catch (error) {

        console.error(error);

        message.textContent =
            "❌ Une erreur est survenue : " +
            error.message;

        submitButton.disabled = false;
    }

});