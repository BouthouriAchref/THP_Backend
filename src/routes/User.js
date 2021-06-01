const express = require('express'),
    AuthRoute = express.Router();
const userController = require('../controller/user-controller')
const uploads = require('../middleware/multer')
const Uploads = require('../controller/user-upload')
const passport = require('passport');
const user = require('../schemas/user');

//const upload = multer({dest: 'uploads/'})
//const cloudinary = require('../use/cloudinary')
//const upload = require('../middleware/multer')

// AuthRoute.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
//     return res.send('hello, this is the API!');
// });
// AuthRoute.get('/special', (req, res) => {
//     return res.json({ msg: `Hey ${req.user.email}! I open at the close` })
// })

AuthRoute.post('/register', userController.registerUser);
AuthRoute.post('/login', userController.loginUser);
AuthRoute.post('/register/facebook', userController.registerUserFacebook);
AuthRoute.get('/user/:userId', userController.GetUserById);
AuthRoute.get('/users', userController.GetAllUsers);
AuthRoute.post('/user/upload/:userId', uploads.upload.single('image'), Uploads.uploadImage);
AuthRoute.get('/user/avatar/:userId', Uploads.getAvatar);
AuthRoute.get('/user/getAvatar/:imageId', Uploads.getImage);
AuthRoute.put('/user/editProfile/:userId', userController.editProfile)
AuthRoute.delete('/users/:userId', userController.deleteUser);

module.exports = AuthRoute;