const mysql = require("mysql2");

const db = mysql.createConnection({
  host: process.env.MYSQLHOST || "localhost",
  port: process.env.MYSQLPORT || 3306,
  user: process.env.MYSQLUSER || "root",
  password: process.env.MYSQLPASSWORD || "",
  database: process.env.MYSQLDATABASE || "tunisian_taekwondo_federation"
});

db.connect((err) => {
  if (err) {
    console.error("Erreur MySQL :", err);
    return;
  }

  console.log("MySQL connecté !");
});

module.exports = db;