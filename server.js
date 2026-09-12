const http = require("http");

const utilisateurRoutes =
    require("./routes/utilisateurRoutes");

const carteRoutes =
    require("./routes/carteRoutes");

const verificationRoutes =
    require("./routes/verificationRoutes");


const server =
    http.createServer(
        (req, res) => {

            console.log(
                req.method,
                req.url
            );



            if (
                utilisateurRoutes(
                    req,
                    res
                )
            ) {
                return;
            }



            if (
                carteRoutes(
                    req,
                    res
                )
            ) {
                return;
            }

            if (
                verificationRoutes(
                    req,
                    res
                )
            ) {
                return;
            }



            res.statusCode = 404;

            res.setHeader(
                "Content-Type",
                "application/json"
            );


            res.end(
                JSON.stringify({
                    message:
                        "Route introuvable"
                })
            );
        }
    );


server.listen(
    3000,
    () => {

        console.log(
            "Serveur démarré sur " +
            "http://localhost:3000"
        );
    }
);