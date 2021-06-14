const evaluation = require('../schemas/evaluation');
const place = require('../schemas/place');


exports.addEvaluation = (req, res) => {
    try {
        console.log('___', req.body, '__', req.params.placeId, '333', req.params.userId)
        let newEvaluation = evaluation(req.body)
        newEvaluation.save((err, Evaluation) => {
            if (err) {
                res.status(400).json({ 'msg': err })
            } else {
                evaluation.findOneAndUpdate({ "_id": newEvaluation._id }, { $set: { "CreatedBy": req.params.userId } }, { new: true, useFindAndModify: false }, (err, evaluation) => {
                    if (err) {
                        res.status(400).json({ 'msg': err })
                    } else {
                        place.findOneAndUpdate({ "_id": req.params.placeId }, { $push: { "Evaluation": Evaluation._id } }, { new: true, useFindAndModify: false }, (err, place) => {
                            if (err) {
                                res.status(400).json({ 'msg': err })
                            } else {
                                res.status(201).json({
                                    msg: 'succes',
                                    place: place
                                })
                            }
                        }).populate({
                            path: "Evaluation",
                            model: "evaluation",
                            select: "-_id"
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

exports.deleteEvaluation = (req, res) => {
    try {
        const id = req.params.placeId;
        evaluation.findByIdAndDelete(req.params.evalId)
            .then(data => {
                if (!data) {
                    res.status(404).send({ message: `Cannot Delete with id ${id}. Maybe id is wrong` })
                } else {
                    place.findOneAndUpdate({ "_id": id }, { $pull: { "Evaluation": req.params.evalId } }, { new: true, useFindAndModify: false }, (err, result) => {
                        if (err) {
                            res.status(400).json({ 'msg': err })
                        } else {
                            res.status(201).json({
                                msg: 'Evaluation was deleted successfully!',
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