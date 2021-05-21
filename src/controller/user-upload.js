const attachement = require('../schemas/attachement');
const user = require('../schemas/user');
const path = require('path')
const fs = require('fs');
const { db } = require('../config/config');

exports.uploadImage = (req, res) => {
    try {
        //console.log('______', req.file.path)
        attachement.create({ "Name": req.file.filename, "Path": "https://tunisian-hidden-places.herokuapp.com/" + req.file.path.replace("\\", "/"), "Size": req.file.size, "Format": req.file.filename.replace(req.file.filename, req.file.filename.substring(req.file.filename.length - 4, req.file.filename.length)) }, async(err, result) => {
            if (err) {
                res.status(500).json({
                    message: "failed uploading",
                    error: err
                })
            } else {
                user.findOneAndUpdate({ "_id": req.params.userId }, { $set: { "Avatar": result._id } }, { new: true, useFindAndModify: false }, (errr, resul) => {
                    if (errr) {
                        res.status(500).json({
                            message: "User Not Found",
                            error: errr
                        })
                    } else {
                        res.status(201).json({
                                message: "succes uploading",
                                result: result
                                    //result: JSON.stringify(result.path).replace('\\','/')
                            })
                            //res.sendFile(path.join('', JSON.stringify(result)))
                            //res.sendFile(path.join(__dirname, 'public', result))
                    }
                }).populate("attachement")
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

exports.getImage = (req, res) => {
    let imgId = req.params.imageId;

    attachement.findById(imgId, (err, image) => {
        if (err) {
            return res.status(400);
        }
        res.setHeader('Content-Type', 'image/jpeg');
        fs.createReadStream(path.join("uploads", image.Name)).pipe(res);
    });
}

exports.getAvatar = (req, res) => {
    try {
        user.findById(req.params.userId, (err, user) => {
            if (!user) {
                res.status(400).json({
                    msg: 'no user found with this ID'
                })
            } else {
                attachement.findOne({ "_id": user.Avatar }, (err, result) => {
                    if (!result) {
                        res.status(400).json({
                            msg: 'The user does not exist'
                        });
                    } else {
                        res.status(200).json({
                            avatar: result

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