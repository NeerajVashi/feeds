const mysql = require('mysql2/promise');

async function db() {
    let connection = await mysql.createConnection({
        host: "localhost",
        user: "neeraj",
        password: "22118255",
        waitForConnections: true,
        connectionLimit: 15,
    });
    connection = await mysql.createPool({
        host: "localhost",
        user: "neeraj",
        password: "22118255",
        database: 'Objects',
        waitForConnections: true,
        connectionLimit: 15,
    });
    await connection.execute('create table Objects.posts(userId int, postId int auto_increment primary key, postData varchar(2000), image varchar(2000), likes int)');
    await connection.execute('create table Objects.comment(postId int, comments varchar(2000), foreign key(postId) references posts(postId))');
    connection.end();
    process.exit();
}
db();
