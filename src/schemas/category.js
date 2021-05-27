const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CategorySchema = new Schema({
    Attachement: {
        type: mongoose.Schema.Types.ObjectId,
        Ref: 'attachment'
    },
    Name: String
})

module.exports = mongoose.model('category', CategorySchema)