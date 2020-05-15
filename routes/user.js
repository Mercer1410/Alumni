var express = require("express");
var router = express.Router();

var User = require("../models/user");
var Feed = require("../models/feed");
var middleware = require("../middleware");

//==============
//USER PROFILE
//==============
router.get("/users/:id",middleware.isLoggedIn, function(req,res){
    User.findById(req.params.id).populate("achievement").populate("news").populate("events").exec(function(err, foundUser){
        if(err){
            console.log(err);
            res.redirect("back");
        }else{
            Feed.find().where("author.id").equals(foundUser._id).exec(function(err, feed){
                if(err){
                    console.log(err);
                    res.redirect("/home");
                }else{
                    res.render("users/ShowUser", {user: foundUser, feed: feed});
                }
            });
        }
    });
});

router.get("/users/:id/edit", middleware.userOwnership, function(req,res){
    User.findById(req.params.id, function(err, foundUser){
        if(err){
            console.log(err);
            res.redirect("back");
        }else{
            res.render("users/UserEdit", {user: foundUser});
        }
    });
});

router.put("/users/:id", middleware.userOwnership, function(req,res){
    User.findByIdAndUpdate(req.params.id, req.body.user, function(err,updatedUser){
        if(err){
            console.log(err);
            res.redirect("back");
        }else{
            req.flash("success", "Updated Profile Successfully");
            res.redirect("/feeds");
        }
    });
});

module.exports = router;