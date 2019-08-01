const mysql = require('mysql2/promise');

const connection = mysql.createPool({
  host: "localhost",
  user: "neeraj",
  password: "22118255",
  database: 'Objects',
  waitForConnections: true,
  connectionLimit: 15,

});
module.exports = connection;
