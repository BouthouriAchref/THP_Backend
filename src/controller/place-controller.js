const Place = require('../schemas/place')
const attachement = require('../schemas/attachement');
const place = require('../schemas/place');
const user = require('../schemas/user');

exports.addPlace = (req, res) => {
    const { name, description, address, state, city, zip, lat, lon, category } = req.body
    const placeToSend = {
        Name: name,
        Description: description,
        Address: {
            location: {
                Lat: lat,
                Lon: lon
            },
            Text: address,
            Departement: state,
            City: city,
            PostalCode: zip
        },
        Category: category
    }
    try {
        // let newPlace = Place(req.body)
        let newPlace = new Place(placeToSend)
        console.log('place', newPlace)
        newPlace.save((err, place) => {
            if (err) {
                res.satus(400).json({ 'msg': err })
            } else {
                user.findOneAndUpdate({ "_id": req.params.userId }, { $set: { "HasPlaces": true }, $push: { "Places": newPlace._id } }, { new: true, useFindAndModify: false }, (err, result) => {
                    if (err) {
                        res.status(400).json({ 'msg': err })
                    } else {
                        res.status(201).json({
                            msg: 'succes',
                            user: result
                        })
                    }
                }).populate([{
                    path: "Places",
                    model: "place"
                }])
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


exports.getPlaceById = (req, res) => {
    try {
        place.findById(req.params.placeId, (err, place) => {
            //console.log('Place', place)
            //console.log('error',err)
            if (err) {
                res.status(400).json({ msg: 'no place found with this ID' })
            }
            let note = 0
            for (let eval of place.Evaluation) {
                if (place.Evaluation.length) {
                    note = eval.Notice + note;
                }
            }
            if (place.Evaluation.length) {
                note = note / place.Evaluation.length;

            }
            //console.log(note)
            place.Notice = note;
            res.status(201).json({
                data: place,
                success: true
            })
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


exports.uploadImagePlace = (req, res) => {
    try {
        attachement.create({ "Name": req.file.filename, "Path": "https://tunisian-hidden-places.herokuapp.com/" + req.file.path.replace("\\", "/"), "Size": req.file.size, "Format": req.file.filename.replace(req.file.filename, req.file.filename.substring(req.file.filename.length - 4, req.file.filename.length)) }, async(err, result) => {
            if (err) {
                res.status(500).json({
                    message: "failed uploading",
                    error: err
                })
            } else {
                Place.findOneAndUpdate({ "_id": req.params.placeId }, { $push: { "Attachement": result._id } }, { new: true, useFindAndModify: false }, (errr, resul) => {
                    if (errr) {
                        res.status(500).json({
                            message: "Place Not Found",
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