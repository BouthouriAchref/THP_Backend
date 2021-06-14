const Place = require('../schemas/place')
const attachement = require('../schemas/attachement');
const place = require('../schemas/place');
const cloudinary = require('../use/cloudinary')
const user = require('../schemas/user');
const config = require('../config/config');

exports.addPlace = (req, res) => {
    //console.log('___', req.body)
    const { name, description, address, state, city, zip, lat, lon } = req.body
    const placeToSend = {
        Name: name,
        Description: description,
        Address: {
            Location: {
                Lat: lat,
                Lon: lon
            },
            Text: address,
            Department: state,
            City: city,
            PostalCode: zip
        }
    }
    try {
        // let newPlace = Place(req.body)
        let newPlace = new Place(placeToSend)
            //console.log('place', newPlace)
        newPlace.save((err, place) => {
            if (err) {
                res.satus(400).json({ 'msg': err })
            } else {
                Place.findOneAndUpdate({ "_id": newPlace._id }, { $set: { "Category": req.body.category, "CreatedBy": req.params.userId } }, { new: true, useFindAndModify: false }, (err, resultt) => {
                    if (err) {
                        res.status(400).json({ 'msg': err })
                    } else {
                        user.findOneAndUpdate({ "_id": req.params.userId }, { $set: { "HasPlaces": true }, $push: { "Places": newPlace._id } }, { new: true, useFindAndModify: false }, (err, result) => {
                            if (err) {
                                res.status(400).json({ 'msg': err })
                            } else {
                                res.status(201).json({
                                    msg: 'succes',
                                    user: result,
                                    place: resultt
                                })
                            }
                        }).populate([{
                            path: "Places",
                            model: "place",
                            populate: {
                                path: "Category",
                                model: "category"
                            }
                        }])
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

exports.getPlaceByCategory = (req, res) => {
    try {
        Place.find({ 'Category': req.params.catId }, (err, places) => {
            if (err) {
                res.status(400).json({

                    'msg': err,
                    success: false
                })
            } else {
                for (let place of places) {
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
                res.status(201).json({
                    data: places,
                    success: true
                })
            }
        }).populate([{
                path: "Attachement",
                model: "attachment"
            },
            {
                path: "Evaluation",
                model: "evaluation"

            },
            {
                path: "Category",
                model: "category"
            },
            {
                path: "CreatedBy",
                model: "user",
                populate: {
                    path: "Avatar",
                    model: "attachment"
                }
            }

        ])
    } catch {
        (err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
    }
}

exports.getPlaceById = (req, res) => {
    try {
        place.findById(req.params.placeId, (err, place) => {
            //console.log('Place', place)
            //console.log('error',err)
            if (err) {
                res.status(400).json({ msg: 'no place found with this ID' })
            } else {
                res.status(201).json({
                    data: place,
                    success: true
                })
            }
        }).populate([{
                path: "Attachement",
                model: "attachment"
            },
            {
                path: "Category",
                model: "category"
            },
            {
                path: "Evaluation",
                model: "evaluation",
                populate: {
                    path: "CreatedBy",
                    model: "user",
                    populate: {
                        path: "Avatar",
                        model: "attachment"
                    }

                }

            },
            {
                path: "CreatedBy",
                model: "user"
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

exports.getAllPlaces = (req, res) => {
    try {
        Place.find({ 'Status': true }, (err, places) => {
            if (err) {
                res.status(400).json({
                    'msg': err,
                    success: false
                })
            } else {
                for (let place of places) {
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
                res.status(201).json({
                    data: places,
                    success: true
                })
            }
        }).populate([{
                path: "Attachement",
                model: "attachment"
            },
            {
                path: "Evaluation",
                model: "evaluation"

            },
            {
                path: "Category",
                model: "category"
            },
            {
                path: "CreatedBy",
                model: "user",
                populate: {
                    path: "Avatar",
                    model: "attachment"
                }
            }
        ])
    } catch {
        (err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
    }
}

exports.getAllPlacesNoCheck = (req, res) => {
    try {
        Place.find({ 'Status': false }, (err, places) => {
            if (err) {
                res.status(400).json({
                    'msg': err,
                    success: false
                })
            } else {
                for (let place of places) {
                    let note = 0
                    for (let eval of place.Evaluation) {
                        if (place.Evaluation.length) {
                            note = eval.Notice + note;
                        }
                    }
                    if (place.Evaluation.length) {
                        note = note / place.Evaluation.length;
                        //console.log('___________________',note)

                    }
                    place.Notice = note;
                    //console.log(note)
                }
                res.status(201).json({
                    data: places,
                    success: true
                })
            }
        }).populate([{
                path: "Attachement",
                model: "attachment"
            },
            {
                path: "CreatedBy",
                model: "user",
                populate: {
                    path: "Avatar",
                    model: "attachment"
                }

            },
            {
                path: "Category",
                model: "category"

            },
            {
                path: "Evaluation",
                model: "evaluation"

            }
        ])
    } catch {
        (err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
    }
}

exports.getAllPlacesToCheck = (req, res) => {
    try {
        Place.find({ Status: { $gt: false } }, (err, places) => {
            if (err) {
                res.status(400).json({
                    'msg': err,
                    success: false
                })
            } else {
                for (let place of places) {
                    let note = 0
                    for (let eval of place.Evaluation) {
                        if (place.Evaluation.length) {
                            note = eval.Notice + note;
                        }
                    }
                    if (place.Evaluation.length) {
                        note = note / place.Evaluation.length;
                        //console.log('___________________',note)

                    }
                    place.Notice = note;
                    //console.log(note)
                }
                res.status(201).json({
                    data: places,
                    success: true
                })
            }
        }).populate([{
                path: "Attachement",
                model: "attachment"
            },
            {
                path: "CreatedBy",
                model: "user",
                populate: {
                    path: "Avatar",
                    model: "attachment"
                }

            },
            {
                path: "Category",
                model: "category"

            },
            {
                path: "Evaluation",
                model: "evaluation"

            }
        ])
    } catch {
        (err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
    }
}

exports.uploadImagePlace = async(req, res) => {
    try {
        const result = await cloudinary.uploader.upload(req.file.path)
            // console.log('___req.file', req.file)
        attachement.create({ "Path": result.secure_url, "Size": result.bytes, "Format": result.format }, async(err, result) => {
            if (err) {
                res.status(500).json({
                    message: "failed uploading",
                    error: err
                })
            } else {
                // console.log('result Attachement', result)
                Place.findOneAndUpdate({ "_id": req.params.placeId }, { $push: { "Attachement": result._id } }, { new: true, useFindAndModify: false }, (errr, resul) => {
                    if (errr) {
                        res.status(500).json({
                            message: "Place Not Found",
                            error: errr
                        })
                    } else {
                        // console.log('place resul', resul)
                        res.status(201).json({
                            message: "succes uploading",
                            result: result,
                            resul: resul
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

exports.uploadImagesPlace = (req, res) => {
    try {
        console.log('___req.file', req.file)
        for (let file of req.files) {
            attachement.create({ "Name": file.filename, "Path": config.path + file.path.replace("\\", "/"), "Size": file.size, "Format": file.filename.replace(file.filename, file.filename.substring(file.filename.length - 4, file.filename.length)) }, async(err, result) => {
                if (err) {
                    res.status(500).json({
                        message: "failed uploading",
                        error: err,
                    })
                } else {
                    console.log('result Attachement', result)
                    Place.findOneAndUpdate({ "_id": req.params.placeId }, { $push: { "Attachement": result._id } }, { new: true, useFindAndModify: false }, (errr, resul) => {
                        if (errr) {
                            res.status(500).json({
                                message: "Place Not Found",
                                error: errr
                            })
                        }
                    })
                }

            })
        }
        res.status(201).json({
            message: "succes uploading",
            result: result
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

exports.deletePlace = (req, res) => {
    try {
        const id = req.params.placeId;
        Place.findByIdAndDelete(id)
            .then(data => {
                if (!data) {
                    res.status(404).send({ message: `Cannot Delete with id ${id}. Maybe id is wrong` })
                } else {
                    res.send({
                        message: "Place was deleted successfully!"
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

exports.deletePlaceById = (req, res) => {
    try {
        const id = req.params.placeId;
        Place.findByIdAndDelete(id)
            .then(data => {
                if (!data) {
                    res.status(404).send({ message: `Cannot Delete with id ${id}. Maybe id is wrong` })
                } else {
                    user.findOneAndUpdate({ "_id": req.params.userId }, { $pull: { "Places": id } }, { new: true, useFindAndModify: false }, (err, result) => {
                        if (err) {
                            res.status(400).json({ 'msg': err })
                        } else {
                            res.send({
                                message: "Place was deleted successfully!"
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

exports.checkPlace = (req, res) => {
    try {
        place.findByIdAndUpdate({ "_id": req.params.placeId }, { $set: { "Status": true } }, (err, place) => {
            if (err) {
                res.status(400).json({ msg: 'no place found with this ID' })
            }
            if (place) {
                res.status(201).json({
                    success: true,
                    place: place
                })
            }

        }).populate([{
                path: "Attachement",
                model: "attachment"
            },
            {
                path: "Evaluation",
                model: "evaluation",
                populate: {
                    path: "CreatedBy",
                    model: "user",
                    populate: {
                        path: "Avatar",
                        model: "attachment"
                    }

                }

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

exports.addPlaceToFavorite = (req, res) => {
    try {
        user.findOneAndUpdate({ "_id": req.params.userId }, { $push: { "FavoritesPlaces": req.params.placeId } }, { new: true, useFindAndModify: false }, (err, result) => {
            if (err) {
                res.status(400).json({ 'msg': err })
            } else {
                res.status(201).json({
                    msg: 'succes',
                    user: result
                })
            }
        }).populate([{
                path: "Attachement",
                model: "attachment"
            },
            {
                path: "Evaluation",
                model: "evaluation",
                populate: {
                    path: "CreatedBy",
                    model: "user",
                    populate: {
                        path: "Avatar",
                        model: "attachment"
                    }

                }

            },
            {
                path: "FavoritesPlaces",
                model: "place"
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

exports.removePlaceToFavorite = (req, res) => {
    try {
        user.findOneAndUpdate({ "_id": req.params.userId }, { $pull: { "FavoritesPlaces": req.params.placeId } }, { new: true, useFindAndModify: false }, (err, result) => {
            if (err) {
                res.status(400).json({ 'msg': err })
            } else {
                res.status(201).json({
                    msg: 'succes',
                    user: result
                })
            }
        }).populate([{
                path: "Attachement",
                model: "attachment"
            },
            {
                path: "Evaluation",
                model: "evaluation",
                populate: {
                    path: "CreatedBy",
                    model: "user",
                    populate: {
                        path: "Avatar",
                        model: "attachment"
                    }

                }

            },
            {
                path: "FavoritesPlaces",
                model: "place"
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

exports.getPlaceSearch = (req, res) => {
    try {
        Place.find({ 'Name': req.params.word, 'Adresse.Department': req.params.word, 'Adresse.City': req.params.word, 'Adresse.Text': req.params.word, 'Adresse.': req.params.word }, (err, places) => {
            if (err) {
                res.status(400).json({

                    'msg': err,
                    success: false
                })
            } else {
                for (let place of places) {
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
                res.status(201).json({
                    data: places,
                    success: true
                })
            }
        }).populate([{
                path: "Attachement",
                model: "attachment"
            },
            {
                path: "Evaluation",
                model: "evaluation"

            },
            {
                path: "Category",
                model: "category"
            },
            {
                path: "CreatedBy",
                model: "user",
                populate: {
                    path: "Avatar",
                    model: "attachment"
                }
            }

        ])
    } catch {
        (err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
    }
}