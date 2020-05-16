var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");


//=================
//USER SCHEMA
//=================
var UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    avatar: String,
    place: String,
    firstName: String,
    lastName: String,
    email: {type: String, unique: true, required: true},
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    isAdmin: {type: Boolean, default: false},
    occupation: String,
    achievement: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Achieve"
        }
    ],
    news: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "New"
        }
    ],
    events: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Event"
        }
    ]
});
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);