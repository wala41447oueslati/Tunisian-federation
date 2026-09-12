const {
    verifierUtilisateur
} = require("../controllers/verificationController");


function verificationRoutes(req, res) {

    if (
        req.method === "GET" &&
        req.url.startsWith("/verification/")
    ) {

        const id =
            req.url.split("/")[2];


        verifierUtilisateur(
            req,
            res,
            id
        );


        return true;
    }


    return false;
}


module.exports = verificationRoutes;