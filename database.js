const mysql = require("mysql2");

const db = mysql.createPool({
    host: process.env.MYSQLHOST || "localhost",
    port: process.env.MYSQLPORT || 3306,
    user: process.env.MYSQLUSER || "root",
    password: process.env.MYSQLPASSWORD || "",
    database: process.env.MYSQLDATABASE || "tunisian_taekwondo_federation",

    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Tester la connexion
db.getConnection((err, connection) => {
    if (err) {
        console.error("Erreur MySQL :", err);
        return;
    }

    console.log("MySQL connecté !");

    connection.release();
});

module.exports = db;