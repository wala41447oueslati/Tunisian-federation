const mysql = require("mysql2");

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "tunisian_taekwondo_federation"
});

db.connect((err) => {
    if (err) {
        console.error("Erreur MySQL :", err);
        return;
    }

    console.log("MySQL connecté !");
});

module.exports = db;