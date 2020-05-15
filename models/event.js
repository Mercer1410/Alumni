var mongoose = require("mongoose");

//================
//EVENTS SCHEMA
//================
var eventSchema = new mongoose.Schema({
    title: String,
    duration: String,
    date: String,
    description: String,
    From: String,
    Till: String,
    Link: String,
    Poster: String,
    createdAt: {type: Date, default: Date.now},
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }
});

module.exports = mongoose.model("Event", eventSchema);