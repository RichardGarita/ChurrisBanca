const mariadb = require('mariadb');
const pool = mariadb.createPool({
    host: 'localhost', 
    database: 'Social',
    user:'root', 
    password: 'R1c4aR9!',
    connectionLimit: 5
});

module.exports = pool;