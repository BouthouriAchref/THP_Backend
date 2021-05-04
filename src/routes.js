const express = require('express'),
    routes = express.Router();
const userController = require('./controller/user-controller');
const passport = require('passport');
const user = require('./schemas/user')

routes.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
    return res.send('hello, this is the API!');
});

routes.post('/register', userController.registerUser);
routes.post('/login', userController.loginUser);

routes.get('/special', (req, res) => {
    return res.json({ msg: `Hey ${req.user.email}! I open at the close` })
})

routes.get('/user/:userId',(req, res)=>{
        user.findById(req.params.userId, (err,user)=>{
            if (err) {
                res.sendStatus(400).json({msg: 'no user found with this ID'})
            }
            res.json(user)
        })
    })

module.exports = routes;