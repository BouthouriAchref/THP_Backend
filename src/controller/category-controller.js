const category = require("../schemas/category");
const attachement = require('../schemas/attachement');

exports.addCategory = (req, res) => {
    try {
        let newCategory = new category(req.body)
        newCategory.save((err, category) => {
            if (err) {
                res.satus(400).json({ 'msg': err })
            } else
                res.status(201).json({
                    message: "category add successfully",
                    category: category
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

exports.uploadImageCategory = (req, res) => {
    try {
        console.log(req.file)
        attachement.create({ "Name": req.file.filename.substr(0, 100), "Path": "https://tunisian-hidden-places.herokuapp.com/" + req.file.path.replace("\\", "/"), "Size": req.file.size, "Format": req.file.filename.replace(req.file.filename, req.file.filename.substring(req.file.filename.length - 4, req.file.filename.length)) }, async(err, result) => {
            if (err) {
                res.status(500).json({
                    message: "failed uploading",
                    error: err
                })
            } else {
                category.findOneAndUpdate({ "_id": req.params.catId }, { $set: { "Attachement": result._id } }, { new: true, useFindAndModify: false }, (errr, resul) => {
                    if (errr) {
                        res.status(500).json({
                            message: "Categry Not Found",
                            error: errr
                        })
                    } else {
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

exports.getAllCategory = (req, res) => {
    try {
        category.find((err, categories) => {
            if (err) {
                res.status(400).json({ 'msg': err })
            } else {
                res.status(201).json({
                    category: categories
                })
            }
        }).populate([{
            path: "Attachement", // name field in shema
            model: "attachment", // name document
        }]);
    } catch {
        (err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
    }
}

exports.getCategoryById = (req, res) => {

    try {
        category.findById(req.params.catId, (err, cat) => {
            if (err) {
                res.status(400).json({ msg: 'no category found with this ID' })
            } else {
                res.status(201).json({
                    data: cat
                })
            }
        }).populate([{
            path: "Attachement",
            model: "attachment"
        }]);
    } catch {
        (err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
    }

}

exports.deleteCategory = (req, res) => {
    try {
        const id = req.params.catId;
        category.findByIdAndDelete(id)
            .then(data => {
                if (!data) {
                    res.status(404).send({ message: `Cannot Delete with id ${id}. Maybe id is wrong` })
                } else {
                    res.send({
                        message: "category was deleted successfully!"
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