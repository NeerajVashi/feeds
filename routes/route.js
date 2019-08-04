const express = require('express');

const app = express.Router();

const bodyParser = require('body-parser');
const Posts = require('../functions/function');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
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
app.delete('/deletePost/:id', async (req, res) => {
    const [result] = await Posts.delPost(req.params.id)

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
app.post('/like/:id', async(req, res) => {
    const postId = req.params.id;
    const likes = req.body.likes;
    const userId = req.body.userId;
    const [posts] = await Posts.likes(likes, postId, userId)
    res.json(posts)
})
module.exports = app;
