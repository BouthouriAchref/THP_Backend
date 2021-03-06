const attachement = require('../schemas/attachement');
const user = require('../schemas/user');
const path = require('path')
const cloudinary = require('../use/cloudinary')
const fs = require('fs');
const { db } = require('../config/config');

exports.uploadImage = async(req, res) => {
    try {
        const result = await cloudinary.uploader.upload(req.file.path)
            //console.log('______', req.file)
        attachement.create({ "Path": result.secure_url, "Size": result.bytes, "Format": result.format }, async(err, result) => {
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