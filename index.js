import express from 'express';
import bodyParser from 'body-parser';
import {dirname} from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static(__dirname + "/public"));

let allPosts = [];
let thisPost;
let postTitles = [];

// Delete post function; sending all posts and current iteration
function deletePost(arr, index){
    // arr filter callback function takes elem value omitted with (_) and index as parameters
    return arr.filter(function(_, idx){
        // compate cuurent idx of array (idx) and compare that to index originally passed. 
            return idx != index;
    })

}

app.get("/", (req, res) => {
    res.render("index.ejs")
})

app.post('/submit', (req, res) =>{
    let postBody = req.body['text'];
    let postTitle = req.body['title'];
    allPosts.push(postBody);
    postTitles.push(postTitle);
    res.render('index.ejs', { posts: allPosts, titles: postTitles})
})

app.post("/delete", (req, res) =>{
    let delPost = req.body['deletePost'];
    let newArr = deletePost(allPosts, delPost);
    let newArr2 = deletePost(postTitles, delPost);
    allPosts = newArr;
    postTitles = newArr2;
    res.render('index.ejs', {posts: allPosts, titles: postTitles})
})

app.post('/edit', (req, res) => {
    let iteration = req.body['postId']
    thisPost = iteration;
    res.render("edit.ejs", {post: allPosts[thisPost]})
})

app.post("/returnEdit", (req, res) => {
    // set new post variable with text pulled from the /edit textbox.
    let newPost = req.body['newPost'];
    // set the old post = to new post with current iteration set inside the /edit post function. 
    allPosts[thisPost] = newPost;
    // redner index.js page with all updated post information. 
    res.render("index.ejs", { posts: allPosts, titles: postTitles});
})

app.post('/returnEditCancel', (req, res) => {
    res.render("index.ejs", { posts: allPosts, titles: postTitles});
})

app.listen(3000, () => {
    console.log("Running on port 3000")
})
