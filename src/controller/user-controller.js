const User = require('../schemas/user');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const Attachment = require('../schemas/attachement');

function createToken(user) {
    return jwt.sign({ id: user.id, email: user.email }, config.jwtSecret, {
        expiresIn: 86400
    });
}

exports.registerUser = (req, res) => {
    try {
        if (!req.body.email || !req.body.password) {
            return res.status(400).json({ 'msg': 'You need to send email and password' });
        }

        User.findOne({ email: req.body.email }, (err, user) => {
            if (err) {

                return res.status(400).json({ 'msg': err });
            }

            if (user) {
                return res.status(400).json({ 'msg': 'The user already exists' });
            }

            let newUser = User(req.body);
            newUser.save((err, user) => {
                if (err) {
                    //console.log('###',err);
                    return res.status(400).json({ 'msg': err });
                }
                console.log(user)
                return res.status(201).json(user);

            });
        })
    } catch {
        (err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
    }
}

exports.registerUserFacebook = async (req, res) => {
    //console.log('user:',req.body.email) 
    try {
        User.findOne({ IDF: req.body.id }, async (err, user) => {
            if (err) {

                return res.status(400).json({ 'msg': err });
            }

            if (user) {
                return res.status(201).json({ messge: 'User found !', user: user });
            } else {
                Attachment.create({ Path: req.body.picture.data.url, Size: req.body.picture.data.height * req.body.picture.data.width }, async (err, att) => {
                    if (err) {
                        res.status(400).json({ 'msg': err });
                    }
                   User.create({ IDF: req.body.id, email: req.body.email, fullname: req.body.name, Birthday: req.body.birthday, Avatar: att._id }, async (err, user) => {
                        if (err) {
                            res.status(400).json({ 'msg': err });
                        } else {
                            res.status(201).json({ message: 'User created successfully', user: user });
                        }
                    })
                })
            }
        }).populate({
            path: "Avatar",// name field in shema
            model: "attachment",// name document
        });
        // .populate({
        //     path: "Avatar",// name field in shema
        //     model: "user",// name document
        //     select: '-_id'
        // });
    } catch {
        (err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
    }
}



exports.loginUser = (req, res) => {
    //console.log('"""', req.body);
    try {
        if (!req.body.email || !req.body.password) {
            return res.status(400).json({ 'msg': 'You need to send email and password' });
        }

        User.findOne({ email: req.body.email }, (err, user) => {
            if (err) {
                return res.status(400).json({ 'msg': err });
            }

            if (!user) {
                return res.status(400).json({ 'msg': 'The user does not exist' });
            }

            user.comparePassword(req.body.password, (err, isMatch) => {
                if (isMatch && !err) {
                    return res.status(200).json({
                        token: createToken(user),
                        id: user.id
                    });
                } else {
                    return res.status(400).json({ msg: 'The email and password don\'t match.' });
                }
            })
        })
    } catch {
        (err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
    }
}

exports.GetUserById = (req, res) => {
    try {
        User.findById(req.params.userId, (err, user) => {
            if (err) {
                res.status(400).json({ msg: 'no user found with this ID' })
            }
            res.json(user)
        }).populate([{
            path: "Avatar",// name field in shema
            model: "attachment",// name document
            },
            {
                path: "Places",
                model: "place",
                populate: {
                    path: "Attachement",
                    model: "attachment"
                }
            },
            // {
            //     path: "Places.Evaluation",
            //     model: "evaluation"
            // }
    ]);
    } catch {
        (err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
    }
}

exports.GetAllUsers = (req, res) => {
    try {
        User.find((err, users) => {
            if (err) {
                res.status(400).json({ 'msg': err })
            } else {
                res.status(201).json({
                    users: users
                })
            }
        }).populate({
            path: "Places",// name field in shema
            model: "place",// name document
            select: '-_id'
        })
    } catch {
        (err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
    }
}