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

    await connection.execute(' DROP TABLE IF EXISTS comment');
    await connection.execute(' DROP TABLE IF EXISTS posts');
    await connection.execute('create table Objects.posts(userId int, postId int auto_increment primary key, postData varchar(2000), image varchar(2000), likes int, status int, firstName varchar(100), surName varchar(200), time varchar(200), userImage varchar(5000) )');
    await connection.execute('create table Objects.comment(postId int, comments varchar(2000),userId varchar(100), userImage varchar(100), commentsLike varchar(100), foreign key(postId) references posts(postId))');
    connection.end();
    process.exit();
}
db();
