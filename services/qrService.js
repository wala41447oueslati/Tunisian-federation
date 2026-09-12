const QRCode = require("qrcode");
const fs = require("fs");
const path = require("path");

const BASE_URL = "http://192.168.100.10:3000";

async function genererQRCode(utilisateurId, dossierDestination) {

    const qrPath = path.join(
        dossierDestination,
        `qr_${utilisateurId}.png`
    );

    const verificationUrl =
        `${BASE_URL}/verification/${utilisateurId}`;

    console.log("URL QR :", verificationUrl);

    await QRCode.toFile(
        qrPath,
        verificationUrl
    );

    return qrPath;
}

module.exports = {
    genererQRCode
};