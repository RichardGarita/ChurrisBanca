const mariadb = require("mariadb");
const pool = mariadb.createPool({
    host: "localhost",
    database: "social",
    user: "root",
    password: "eithel",
    connectionLimit: 5,
});

module.exports = pool;
