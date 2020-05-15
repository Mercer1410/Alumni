var mongoose = require("mongoose");

//================
//NEWS SCHEMA
//================
var newsSchema = new mongoose.Schema({
    detail: String,
    date: String,
    createdAt: {type: Date, default: Date.now},
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }
});

module.exports = mongoose.model("New", newsSchema);