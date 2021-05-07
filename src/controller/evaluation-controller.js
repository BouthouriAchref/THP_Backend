const evaluation = require('../schemas/evaluation');
const place = require('../schemas/place');


exports.addEvaluation = (req, res) => {
    try {
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

