var mongoose = require("mongoose");

//=================
//FEED SCHEMA
//=================
var feedSchema = new mongoose.Schema({
    title: String,
    image: String,
    createdAt: {type: Date, default: Date.now},
    description: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    comment: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});
module.exports = mongoose.model("Feed", feedSchema);