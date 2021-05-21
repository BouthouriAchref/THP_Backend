const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    IDF: {
        type: String,
        default: null
    },
    password: {
        type: String,
        //required: true
    },
    Gender: {
        type: String,
        enum: ["Male", "Female", ""],
        default: ""
    },
    Birthday: {
        type: String,
        default: ""
    },
    Nationalite: {
        type: String,
        default: ""
    },
    Avatar: {
        type: mongoose.Schema.Types.ObjectId,
        Ref: 'attachment'

    },
    Attachments: {
        type: mongoose.Schema.Types.ObjectId,
        Ref: 'attachment'
    },
    Places: [{
        type: mongoose.Schema.Types.ObjectId,
        Ref: 'place'
    }],
    HasPlaces: {
        type: Boolean,
        default: false
    },
    FavoritesPlaces: [{
        type: mongoose.Schema.Types.ObjectId,
        Ref: 'place'
    }],
    CreatedAt: {
        type: Date,
        default: Date.now
    }
})

UserSchema.pre('save', function(next) {
    const user = this;

    if (!user.isModified('password')) return next();

    bcrypt.genSalt(10, function(err, salt) {
        if (err) return next(err);

        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return (err);

            user.password = hash;
            next();
        });

    });

});

UserSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

module.exports = mongoose.model('user', UserSchema)