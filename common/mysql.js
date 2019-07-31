const mysql = require('mysql2/promise');

const connection = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "password",
  database: 'posts_db',
  waitForConnections: true,
  connectionLimit: 15,

});
module.exports = connection;
