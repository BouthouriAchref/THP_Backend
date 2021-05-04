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
        //console.log('place', newPlace)
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

exports.getPlaceById = (req, res) => {
    try {
        place.findById(req.params.placeId, (err, place) => {
            console.log('Place', place)
            //console.log('error',err)
            if (err) {
                res.status(400).json({ msg: 'no place found with this ID' })
            }
            res.status(201).json(place)
        })
            .populate({
                path: "Attachement",
                model: "attachment"
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


exports.getAllPlaces = (req, res) => {
    try {
        Place.find((err, places) => {
            if (err) {
                res.status(400).json({
                    'msg': err,
                    success: false
                })
            } else {
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
        attachement.create({ "Name": req.file.filename, "Path": "http://localhost:3000/" + req.file.path.replace("\\", "/"), "Size": req.file.size, "Format": req.file.filename.replace(req.file.filename, req.file.filename.substring(req.file.filename.length - 4, req.file.filename.length)) }, async (err, result) => {
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



