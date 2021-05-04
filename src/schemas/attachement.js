const mongoose = require('mongoose')
const Schema = mongoose.Schema

const AttachmentSchema = new Schema({
    Name: String,
    Path: String,
    Size: String,
    Format: String,
})

module.exports = mongoose.model('attachment', AttachmentSchema)