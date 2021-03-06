const User = require('../schemas/user');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const Attachment = require('../schemas/attachement');
const bcrypt = require('bcrypt');
const user = require('../schemas/user');

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

exports.registerUserFacebook = async(req, res) => {
    //console.log('user:',req.body.email) 
    try {
        User.findOne({ IDF: req.body.id }, async(err, user) => {
            if (err) {

                return res.status(400).json({ 'msg': err });
            }

            if (user) {
                return res.status(201).json({ messge: 'User found !', user: user });
            } else {
                Attachment.create({ Path: req.body.picture.data.url, Size: req.body.picture.data.height * req.body.picture.data.width }, async(err, att) => {
                    if (err) {
                        res.status(400).json({ 'msg': err });
                    }
                    User.create({ IDF: req.body.id, email: req.body.email, fullname: req.body.name, Birthday: req.body.birthday, Avatar: att._id }, async(err, user) => {
                        if (err) {
                            res.status(400).json({ 'msg': err });
                        } else {
                            res.status(201).json({ message: 'User created successfully', user: user });
                        }
                    })
                })
            }
        }).populate({
            path: "Avatar", // name field in shema
            model: "attachment", // name document
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
    console.log('"""', req.body);
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
                    console.log(user.password)
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
    console.log(req.params.userId)
    try {
        User.findById(req.params.userId, (err, user) => {
            // console.log(user)
            if (err) {
                res.status(400).json({ msg: 'no user found with this ID' })
            } else {
                for (let place of user.Places) {
                    let note = 0
                    for (let eval of place.Evaluation) {
                        if (place.Evaluation.length) {
                            note = eval.Notice + note;
                        }
                    }
                    if (place.Evaluation.length) {
                        note = note / place.Evaluation.length;
                        //console.log('___________________', note)

                    }
                    place.Notice = Math.floor(note);
                    //console.log(note)
                }
                for (let favoriteplace of user.FavoritesPlaces) {
                    let note = 0
                    for (let eval of favoriteplace.Evaluation) {
                        if (favoriteplace.Evaluation.length) {
                            note = eval.Notice + note;
                        }
                    }
                    if (favoriteplace.Evaluation.length) {
                        note = note / favoriteplace.Evaluation.length;
                        //console.log('___________________', note)

                    }
                    favoriteplace.Notice = Math.floor(note);
                    //console.log(note)
                }
                res.json(user)
            }

        }).populate([{
                path: "Avatar", // name field in shema
                model: "attachment", // name document
            },
            {
                path: "Places",
                model: "place",
                populate: (
                    [{
                        path: "Attachement",
                        model: "attachment"
                    }, {
                        path: "Evaluation",
                        model: "evaluation"
                    }]
                )

            },
            {
                path: "FavoritesPlaces",
                model: "place",
                populate: (
                    [{
                        path: "Attachement",
                        model: "attachment"
                    }, {
                        path: "Evaluation",
                        model: "evaluation"
                    }]
                )

            }
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
        User.find({ 'IsAdmin': false }, (err, users) => {
            if (err) {
                res.status(400).json({ 'msg': err })
            } else {
                // console.log(users)
                res.status(201).json({
                    users: users
                })
            }

        }).populate([{
                path: "Avatar", // name field in shema
                model: "attachment", // name document
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

exports.deleteUser = (req, res) => {
    try {
        const id = req.params.userId;

        User.findByIdAndDelete(id)
            .then(data => {
                if (!data) {
                    res.status(404).send({ message: `Cannot Delete with id ${id}. Maybe id is wrong` })
                } else {
                    res.send({
                        message: "User was deleted successfully!"
                    })
                }
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

exports.editProfile = (req, res) => {
    let newBirthday, newGender, newNationalite, newfullname;
    console.log('crendetialform', req.body, '\nid', req.params.userId)
    try {
        User.findById({ "_id": req.params.userId }, (err, resul) => {
            if (err) {
                res.status(500).json({
                    message: "User Not Found",
                    error: errr
                })
            } else {
                if (!req.body.Birthday) {
                    newBirthday = resul.Birthday
                } else {
                    newBirthday = req.body.Birthday
                }
                if (!req.body.Gender) {
                    newGender = resul.Gender
                } else {
                    newGender = req.body.Gender
                }
                if (!req.body.Nationalite) {
                    newNationalite = resul.Nationalite
                } else {
                    newNationalite = req.body.Nationalite
                }
                if (!req.body.fullname) {
                    newfullname = resul.fullname
                } else {
                    newfullname = req.body.fullname
                }
                if (!req.body.newpassword) {
                    newpassword = resul.password

                } else {
                    resul.comparePassword(req.body.oldpassword, (err, isMatch) => {
                        if (isMatch && !err) {
                            bcrypt.genSalt(10, function(err, salt) {
                                //if (err) return next(err);

                                bcrypt.hash(req.body.newpassword, salt, function(err, hash) {
                                    //if (err) return (err);

                                    newpassword = hash;
                                    console.log('newpassword', newpassword)
                                        //next();
                                });

                            });
                        }
                    })

                }
                User.findByIdAndUpdate({ "_id": req.params.userId }, { $set: { "Birthday": newBirthday, "Gender": newGender, "Nationalite": newNationalite, "fullname": newfullname } }, { new: true, useFindAndModify: false }, (err, result) => {
                    if (err) {
                        res.status(500).json({
                            message: "User Not Found",
                            error: errr
                        })
                    } else {
                        res.status(201).json({
                            message: "succes updating",
                            result: result
                        })
                    }
                }).populate([{
                        path: "Avatar", // name field in shema
                        model: "attachment", // name document
                    },
                    {
                        path: "Places",
                        model: "place",
                        populate: {
                            path: "Attachement",
                            model: "attachment"
                        }
                    },
                    {
                        path: "FavoritesPlaces",
                        model: "place",
                        populate: {
                            path: "Attachement",
                            model: "attachment"
                        }
                    }
                ]);
            }
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

exports.updatePassword = (req, res) => {
    let newPassword;
    try {
        User.findById({ "_id": req.params.userId }, (err, result) => {
            if (err) {
                res.status(500).json({
                    message: "User Not Found",
                    error: errr
                })
            } else {
                result.comparePassword(req.body.oldpassword, (err, isMatch) => {
                    if (isMatch && !err) {
                        bcrypt.genSalt(10, function(err, salt) {
                            //if (err) return next(err);
                            console.log('salt', salt)

                            bcrypt.hash(req.body.newpassword, salt, function(err, hash) {
                                //if (err) return (err);

                                newPassword = hash;
                                console.log('newpassword', newPassword)
                                    //next();
                                User.findByIdAndUpdate({ "_id": req.params.userId }, { $set: { 'password': newPassword } }, { new: true, useFindAndModify: false }, (err, result) => {
                                    if (err) {
                                        res.status(500).json({
                                            message: "User Not Found",
                                            error: errr
                                        })
                                    } else {
                                        res.status(201).json({
                                            updatePassword: true,
                                            head: 'Info',
                                            message: "succes updating",
                                            result: result
                                        })
                                    }
                                }).populate([{
                                        path: "Avatar", // name field in shema
                                        model: "attachment", // name document
                                    },
                                    {
                                        path: "Places",
                                        model: "place",
                                        populate: {
                                            path: "Attachement",
                                            model: "attachment"
                                        }
                                    },
                                    {
                                        path: "FavoritesPlaces",
                                        model: "place",
                                        populate: {
                                            path: "Attachement",
                                            model: "attachment"
                                        }
                                    }
                                ]);
                            });

                        });

                    } else {
                        res.status(400).json({
                            updatePassword: false,
                            head: 'Warning',
                            message: 'Password invalid'
                        })
                    }
                })

            }

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