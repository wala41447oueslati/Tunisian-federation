const mysql = require("mysql2");

const db = mysql.createPool({
    host: process.env.MYSQLHOST,
    port: process.env.MYSQLPORT,
    user: process.env.MYSQLUSER,
    password: process.env.MYSQLPASSWORD,
    database: process.env.MYSQLDATABASE,

    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

db.query("SELECT DATABASE() AS databaseName", (err, result) => {
    if (err) {
        console.error("ERREUR MYSQL :", err);
        return;
    }

    console.log("DATABASE UTILISÉE :", result);
});

module.exports = db;