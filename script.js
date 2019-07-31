const mysql = require('mysql2/promise');

async function db() {
    let connection = await mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "password",
        waitForConnections: true,
        connectionLimit: 15,
    });
    connection = await mysql.createPool({
        host: "localhost",
        user: "root",
        password: "password",
        database: 'posts_db',
        waitForConnections: true,
        connectionLimit: 15,
    });
    await connection.execute('create table posts(userId int, postId int auto_increment primary key, postData varchar(2000), mainImg varchar(100), likes int)');
    await connection.execute('create table posts_db.comment(postId int, comments varchar(2000), foreign key(postId) references posts(postId))');
    connection.end();
    process.exit();
}
db();