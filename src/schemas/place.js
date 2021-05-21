const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PlaceSchema = new Schema({
        Attachement: [{
            type: mongoose.Schema.Types.ObjectId,
            Ref: 'attachment'
        }],
        Name: String,
        Description: String,
        Address: {
            Location: { Lat: String, Lon: String },
            Text: String,
            Department: String,
            City: String,
            PostalCode: String
        },
        Category: String,
        Evaluation: [{
            type: mongoose.Schema.Types.ObjectId,
            Ref: 'evaluation'
        }],
        Notice: Number,
        Status: {
            type: Boolean,
            default: false
        }
    })
    //PlaceSchema.plugin(require('mongoose-autopopulate'))
module.exports = mongoose.model('place', PlaceSchema)