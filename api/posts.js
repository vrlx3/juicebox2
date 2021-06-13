const e = require('express');
const express = require('express');
const postsRouter = express.Router();
const {getAllPosts, createPost, updatePost, getPostById} = require('../db');
const { post } = require('./users');
const {requireUser} = require('./utils');




postsRouter.post('/', requireUser, async (req, res, next) => {
    
    const {title, content, tags = ""} = req.body;
    console.log('title..', title,'content....', content,'tags...', tags)

    const tagArr = tags.trim().split(/\s+/)
    const postData = {};

    if(tagArr.length) { postData.tags = tagArr}

    try{
        postData.title = title;
        postData.content = content;
        postData.authorId = req.user.id

        console.log('postdata is....', postData)

        const post = await createPost(postData) 
        if (post) {res.send({post});}
        else { next({name: "ErrorCreatinPost", message: "There was an error creating post please check"})}

    }
    catch ({name, message}) {next({name, message})}


});

postsRouter.patch('/:postId', async (req, res, next) => {
    const {postId} = req.params;
    const {title, content, tags} = req.body;

    const updateField = {};


    if (tags && tags.length > 0 ) {
        updateField.tags = tags.trim().split(/\s+/)
    }

    if (title) {
        updateField.title = title
    }

    if (content) {
        updateField.content = content
    }

    try{
        const originalPost = await getPostById(postId);

        // console.log('orginalPost.author.id...', originalPost.author.id)
        // console.log('req user id ...', req.user.id)
        // console.log((originalPost.author.id === req.user.id))

        if (originalPost.author.id === req.user.id) {
            const updatedPost = await updatePost(updateField);
            res.send({post: updatedPost})
        }
        else {
            next({
                name: "NoNoNo",
                message: "Not Authorized"
            })
        }
    }
    catch({name, message}){next({name, message})}


})


postsRouter.delete(
    '/:postId',
    requireUser,
    async (req, res, next) => {
        try{
            const post = await getPostById(req.params.postId);

            if (post && post.author.id === req.user.id){
                const updatedPost = await updatePost(post.id, {active: false})
                res.send({pos: updatedPost})

            } else {
                next( post ?
                    {
                        name: "WrongPost",
                        message: "A oh you didn't make it"
                    } : {
                        name: "PostNotFound",
                        message: "That post doesn't exsist"
                    })
            }

        }
        catch ({name, message}) {
            next ({next, message})
        }
    }
)



postsRouter.get(
    '/',
    async (req, res, next) => {
        const allPosts = await getAllPosts();
        const posts = allPosts.filter(post => {
                return post.active || (req.user && post.author.id === req.user.id);
              });
       
       
        res.send({
            posts
        })
    }
)

module.exports = postsRouter;
