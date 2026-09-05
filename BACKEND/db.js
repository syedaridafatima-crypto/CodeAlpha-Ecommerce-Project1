require("dotenv").config();

const mysql = require("mysql2");

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
   password: process.env.DB_PASSWORD,
    database: "shopease"
});

db.connect(function(err) {

    if (err) {
        console.log("Database connection failed:", err);
        return;
    }

    console.log("MySQL database connected!");

});

module.exports = db;