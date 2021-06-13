const express = require('express');
const tagsRouter = express.Router();
const {getAllTags, getPostsByTagName} = require('../db');


tagsRouter.get('/:tagName/posts', async (req, res, next) => {
    console.log('tag req came in...')

    const {tagName} = req.params;
    console.log('tagname...', tagName)

    // read the tagname from the params
    try {
        const postByTagName = await getPostsByTagName(tagName)
        const tagFilter = postByTagName.filter(tag => {
            return tag.active || (req.user && tag.author.id === req.user.id)
        })
        res.send({postByTagName})
       


      // use our method to get posts by tag name from the db
      // send out an object to the client { posts: // the posts }
    } catch ({ name, message }) {
        next({name: "ErrorFetchingTag",
        message: "please check input"})
      // forward the name and message to the error handler
    }
  });


tagsRouter.use(
    '/',
    async (req, res, next) => {
        const tags = await getAllTags();
        res.send({tags})

        console.log('all tags hit')
           next() ;
    }
)

module.exports = tagsRouter;