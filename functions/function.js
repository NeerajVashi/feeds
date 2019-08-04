const mysql = require('mysql');

const connection = require('./../common/mysql')

async function getPost() {
    const data = await connection.execute('select * from posts');
    const returnData = data[0];
    return returnData;
}
async function addPostText(obj) {
    console.log(obj.body)
    await connection.execute('INSERT INTO posts(userId, postData, image, likes, status, firstName, surName, time, userImage) VALUES (?,?,?,?,?,?,?,?,?)',
    [obj.body.userId, obj.body.postData, ' ', obj.body.likes, obj.body.status, obj.body.firstName, obj.body.surName, obj.body.time, obj.body.userImage]);
    const data = await connection.execute('select * from posts');
    return data;
}
async function addPost(obj) {
    console.log(obj)
    const data = await connection.execute('INSERT INTO posts(userId, postData,image,likes) VALUES (?,?,?,?)',
    [obj.body.userId, obj.body.postData,' ',obj.body.likes]);
    console.log(data[0])
    return data[0];
}
async function addImage(imgData) {
	await connection.query(`UPDATE posts SET image = ? where postId = ?`, [imgData.img, imgData.postId]);
	const [query] = await connection.query('select * from posts');
	return query;
}
async function Likes(id) {
    const data = await connection.execute('SELECT likes from posts where postId = ?', [id]);
    const result = await JSON.parse(JSON.stringify(data[0]));
    const likes = result[0].likes + 1;
    if (likes === 2) {
        return likes;
    }
    const updQuery = 'UPDATE ?? SET ?? = ? WHERE ?? = ?';
    const query = mysql.format(updQuery, ['posts', 'likes', likes, 'postId', id]);
    const upd = await connection.execute(query);
    return likes;
}
async function fetchLikes(id) {
    const data = await connection.execute('SELECT likes from posts where postId = ?', [id]);
    const result = await JSON.parse(JSON.stringify(data[0]));
    const likes = result[0].likes;
    console.log(likes);
    return likes;
}
async function Comments(obj) {
    console.log(obj);
    await connection.execute('INSERT INTO comment(postId,userId,comments,commentsLike,userImage) VALUES (?,?,?,?,?)',[obj.id, obj.userId, obj.comments, obj.likePost, obj.userImage]);
    const query = await connection.execute(`SELECT * FROM comment where postId = ${obj.id}`);
    const data = await JSON.parse(JSON.stringify(query[0]));
    return data;
}
async function delPost(id) {
    console.log('id = ',id);
    await connection.execute('DELETE FROM comment where postId = ?', [id]);
    await connection.execute('DELETE FROM posts where postId = ?', [id]);
    const posts = await connection.execute('select  * FROM posts');
    return posts;
}
async function addComment(comment) {
    console.log('inside query', comment);
    await connection.execute('INSERT INTO comment(postId,userId,comments,commentsLike,userImage) VALUES (?,?,?,?,?)',[comment.id, comment.userId, comment.comments, comment.likeComment, comment.userImage]);
    const comments = await connection.execute(`SELECT * FROM comment where postId = ${comment.id}`);
    // const comments = await connection.execute(`SELECT * FROM comment where postId = ${comment.id}`);
    return comments;
}
async function comment(id) {
    console.log('id');
    const comments = await connection.execute(`SELECT * FROM comment where postId = ${id}`);
    return comments;
}
async function likes(like, postId) {
    await connection.execute('update posts set likes = ? where postId = ?', [like, postId])
    const posts = await connection.execute('select * from posts')
    return posts;
}
module.exports.getPost = getPost;
module.exports.addImage = addImage;
module.exports.addPost = addPost;
module.exports.Likes = Likes;
module.exports.delPost = delPost;
module.exports.Comments = Comments;
module.exports.fetchLikes = fetchLikes;
module.exports.addPostText = addPostText;
module.exports.addComment = addComment;
module.exports.comment = comment;
module.exports.likes = likes;