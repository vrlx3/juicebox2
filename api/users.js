const express = require('express');
const usersRouter = express.Router();
const {getAllUsers, getUserByUsername, createUser} = require('../db');
const jwt = require('jsonwebtoken');
const {JWT_SECRET} = process.env;




usersRouter.use(
    (req, res, next) => {
        console.log('A request is being made to /users')
    //     const heads = req.headers['Authorization']
    //    console.log(req.headers)
        next ()
    }
)



usersRouter.post('/login', async(req, res, next) => {
    
    const { username, password} = req.body;
  
    if (!username || !password) {
        next({
            name: "Missing credential",
            message: "Please supply both."
        })
    }
   
    try {

        const user = await getUserByUsername(username);

        if (user && user.password == password) {

            const token = jwt.sign({id:user.id, username}, process.env.JWT_SECRET)
           
            res.send({
                message: "you're logged in!",
                token 
            })
        } else {
            next({
                name: "Incorrect Credentials Error",
                message: "Username and password doesn't match"
            })
        }
    }
    catch (error) {
        console.log(error)
        next(error)
    }
})


usersRouter.post('/register', async (req, res, next) => {
    const {username, password, name, location} = req.body;

    try {
        const _user = await getUserByUsername(username);

        if (_user) {
            res.send({
                name: "UserAlreadyExsists",
                message: "Please choose a different user name"
            })
        }

        const user = await createUser({username, password, name, location})
        const token = jwt.sign({id:user.id, username}, process.env.JWT_SECRET)
        res.send({
            message: "Thank you for registering",
            token
        })

    }
    catch ({name, message}){
        next({name, message})    
    }
})


usersRouter.use(
    '/', 
    async (req,res) => {
        const users = await getAllUsers()
       res.send({users})
    }
) 

module.exports = usersRouter;

