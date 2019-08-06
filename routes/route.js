const express = require('express');

const app = express.Router();

const bodyParser = require('body-parser');
const Posts = require('../functions/function');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/home', (req, res) => {
    res.send('you are in home');
})

app.get('/allPosts/:id', async (req, res) => {
    const userId = req.params.id;
    console.log('userId', userId)
    const [posts] = await Posts.postsForUsers(userId);
    res.json(posts);
});

app.get('/userPost/:id', async (req, res) => {
    const userId = req.params.id;
    const [posts] = await Posts.userPost(userId);
    res.json(posts);
})

app.get('/postdata', async (req, res) => {
    const postData = await Posts.getPost();
    res.json(postData);
});

app.post('/postdata', async (req, res) => {
    const resObj = {}
    const postData = await Posts.addPost(req);
    if(postData.affectedRows === 1) {
        res.json(postData.insertId);
    }
    res.json(resObj);
});

app.post('/posttext', async (req, res) => {
    console.log('posttext', req.body);
    const [postData] = await Posts.addPostText(req);
    console.log("end")
    res.json(postData);
});


app.get('/fetchComment/:id', async (req, res) => {
    const ans = await Posts.fetchComment(req.params.id);
    res.json(ans);
})
app.get('/updLikes/:id', async(req, res) => {
    const likes = await Posts.Likes(req.params.id)
    res.json(likes);
})
app.get('/fetchLikes/:id', async(req, res) => {
    const likes = await Posts.fetchLikes(req.params.id);
    res.json(likes);
})
app.put('/addimage', async(req, res) => {
    const data = await Posts.addImage(req.body);
    res.json(data);
})
app.post('/comment', async(req, res) => {
    console.log(req.body);
    const comments = await Posts.Comments(req.body);
    console.log(comments);
    res.json(comments);
})
// app.delete('/deletePost/:id', async (req, res) => {
//     const [result] = await Posts.delPost(req.params.id)
//     res.json(result);
// })
app.delete('/deletePost/:id', async (req, res) => {
    const Id = {
        postId:req.params.id,
        userId:req.body.userId
    }
    console.log('Id', Id);
    const result = await Posts.deletePost(Id)
    res.json(result);
})

app.delete('/deleteHomePost', async (req, res) => {
    console.log('inside delte home post');
    const Id = req.body;
    const [result] = await Posts.deleteHomePost(Id)
    res.json(result);
})

app.delete('/deletePersonalPost', async (req, res) => {
    const Id = req.body;
    const [result] = await Posts.deletePersonalPost(Id)
    res.json(result);
})


app.post('/addComments', async(req, res) => {
    const comment = req.body;
    console.log('comments', comment);
    const [comments] = await Posts.addComment(comment);
    res.json(comments);
})
app.get('/comments/:id', async(req, res) => {
    const id = req.params.id;
    console.log('post id', id);
    const [comments] = await Posts.Comment(id);
    res.json(comments);
})
app.put('/like', async(req, res) => {
    const post = req.body;
    console.log('post', post);
    const [posts] = await Posts.likes(post)
    res.json(posts)
})

app.get('/postNotification/:id', async(req, res) => {
    const id = req.params.id;
    console.log('id', id);
    const [posts] = await Posts.postNotification(id);
    res.json(posts);
})
module.exports = app;
