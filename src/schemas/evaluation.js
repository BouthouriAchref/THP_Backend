const mongoose = require('mongoose')
const Schema = mongoose.Schema

const EvaluationSchema = new Schema({
    CreatedAt: {
        type: Date,
        default: Date.now
    },
    Notice: Number,
    Comment: String,
    CreatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        Ref: 'user'
    }
})

module.exports = mongoose.model('evaluation', EvaluationSchema)