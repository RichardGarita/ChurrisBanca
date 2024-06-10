const mariadb = require("mariadb");
const pool = mariadb.createPool({
    host: "localhost",
    database: "social",
    user: "root",
    password: "R1c4aR9!",
    connectionLimit: 5,
});

module.exports = pool;
