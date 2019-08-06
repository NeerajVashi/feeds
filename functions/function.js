const mysql = require('mysql');

const connection = require('./../common/mysql')

async function postsForUsers(userId) {
    try {
        const id = userId;
        // posts = await connection.execute(`(select * from posts where status = ${2}) union (select * from posts where posts.userId in (select friendId from friends where userId = ${id} and status = ${0}))`)
        const posts = await connection.execute(`(select * from posts where status = ${2} or userId = ${userId}) union (select * from posts where  posts.userId in (select senderId from friendsTable where status = ${1} and receiverId = ${userId} union select receiverId from friendsTable where status = ${1} and senderId = ${userId}) and status = ${0}) order by time`)
        return posts;
    } catch (err) {
        console.log('err in post for all', err);
    }

}
async function userPost(userId) {
    try {
        const posts = await connection.execute('select * from posts where userId = ?', [userId]);
        return posts;
    } catch (err) {
        console.log('err in userPost', err)
    }
}

async function getPost() {
    const data = await connection.execute('select * from posts');
    const returnData = data[0];
    return returnData;
}
async function addPostText(obj) {
    console.log(obj.body)
    await connection.execute('INSERT INTO posts(userId, postData, image, likes, status, firstName, surName, time, userImage) VALUES (?,?,?,?,?,?,?,?,?)',
    [obj.body.userId, obj.body.postData, ' ', obj.body.likes, obj.body.status, obj.body.firstName, obj.body.surName, obj.body.time, obj.body.userImage]);
    // const data = await connection.execute('select * from posts');
    // return data;
    const posts = await connection.execute(`(select * from posts where status = ${2} or userId = ${obj.body.userId}) union (select * from posts where  posts.userId in (select senderId from friendsTable where status = ${1} and receiverId = ${obj.body.userId} union select receiverId from friendsTable where status = ${1} and senderId = ${obj.body.userId}) and status = ${0}) order by time`)
    console.log('posts', posts);
    return posts;
}

// async function addPost(obj) {
//     console.log('add post', obj.body)
//     const postData = obj.body.postData;
//     if( postData.length <= 1 ) {
//         console.log('inside postData.length', postData.length);
//         const data = await connection.execute('INSERT INTO posts(userId, postData, image, likes, status, firstName, surName, time, userImage) VALUES (?,?,?,?,?,?,?,?,?)',
//         [obj.body.userId, '' , ' ', obj.body.likes, obj.body.status, obj.body.firstName, obj.body.surName, obj.body.time, obj.body.userProfile]);
//         console.log(data[0])
//         return data[0];
//     } else {
//         console.log('inside else  postData.length', postData.length);
//         const data = await connection.execute('INSERT INTO posts(userId, postData, image, likes, status, firstName, surName, time, userImage) VALUES (?,?,?,?,?,?,?,?,?)',
//         [obj.body.userId, obj.body.postData, ' ', obj.body.likes, obj.body.status, obj.body.firstName, obj.body.surName, obj.body.time, obj.body.userProfile]);
//         console.log(data[0])
//         return data[0];
//     }

//     // const data = await connection.execute('INSERT INTO posts(userId, postData,image,likes) VALUES (?,?,?,?)',
//     // [obj.body.userId, obj.body.postData,' ',obj.body.likes]);
//     // console.log(data[0])
//     // return data[0];
// }

async function addPost(obj) {
    console.log('add post', obj.body)
    const data = await connection.execute('INSERT INTO posts(userId, postData,image,likes) VALUES (?,?,?,?)',
    [obj.body.userId, obj.body.postData,' ',obj.body.likes]);
    console.log(data[0])
    return data[0];
}

async function addImage(imgData) {
    await connection.query(`UPDATE posts SET image = ? where postId = ?`, [imgData.img, imgData.postId]);
    const [posts] = await connection.execute(`(select * from posts where status = ${2} or userId = ${imgData.userId}) union (select * from posts where  posts.userId in (select senderId from friendsTable where status = ${1} and receiverId = ${imgData.userId} union select receiverId from friendsTable where status = ${1} and senderId = ${imgData.userId}) and status = ${0}) order by time Desc `)
    return posts;
}

// async function addImage(imgData) {
//     console.log('imgData', imgData);
// 	await connection.query(`UPDATE posts SET image = ? where postId = ?`, [imgData.img, imgData.postId]);
// 	const [query] = await connection.query('select * from posts');
// 	return query;
// }
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
    const [posts] = await connection.execute('select * FROM posts');
    const [userPosts] = await connection.execute('select ')
    return posts;
}

async function deleteHomePost(Id) {
    try {
        await connection.execute('DELETE FROM comment where postId = ?', [Id.postId]);
        await connection.execute('DELETE FROM posts where postId = ?', [Id.postId]);
        const posts = await connection.execute(`(select * from posts where status = ${2} or userId = ${Id.userId}) union (select * from posts where  posts.userId in (select senderId from friendsTable where status = ${1} and receiverId = ${Id.userId} union select receiverId from friendsTable where status = ${1} and senderId = ${Id.userId}) and status = ${0}) order by time Desc `)
        return posts;

    } catch (err) {
        console.log('err in deletepost', err);
    }
}
async function deletePersonalPost(Id) {
    try {
        await connection.execute('DELETE FROM comment where postId = ?', [Id.postId]);
        await connection.execute('DELETE FROM posts where postId = ?', [Id.postId]);
        const posts = await connection.execute(`select * from posts where userId = ${Id.userId} `)
        return posts;
    } catch (err) {
        console.log('err in deletepost', err);
    }
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
async function likes(post) {
    await connection.execute('update posts set likes = ? where postId = ?', [post.likes, post.postId])
    const posts = await connection.execute(`(select * from posts where status = ${2} or userId = ${post.userId}) union (select * from posts where  posts.userId in (select senderId from friendsTable where status = ${1} and receiverId = ${post.userId} union select receiverId from friendsTable where status = ${1} and senderId = ${post.userId}) and status = ${0}) order by time Desc `)
    return posts;
}

async function postNotification(id) {
    const posts = await connection.execute(`(select * from posts where status = ${0}) union (select * from posts where  posts.userId in (select senderId from friendsTable where status = ${1} and receiverId = ${id} union select receiverId from friendsTable where status = ${1} and senderId = ${id})) order by time `)
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
module.exports.postsForUsers = postsForUsers;
module.exports.userPost = userPost;
// module.exports.deletePost = deletePost;
module.exports.deleteHomePost = deleteHomePost;
module.exports.deletePersonalPost = deletePersonalPost;
module.exports.postNotification = postNotification;