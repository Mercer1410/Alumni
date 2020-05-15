var express = require("express");
var router = express.Router();

var Feed = require("../models/feed");
var User = require("../models/user");
var middleware = require("../middleware");

//===============
//Feeds Route
//===============
router.get("/feeds", middleware.isLoggedIn, function(req,res){
    Feed.find({}).populate("comment").exec(function(err, allFeed){
        if(err){
            console.log(err);
        }else{
            User.find({}, function(err, allusers){
                if(err){
                    console.log(err);
                }else{
                    res.render("feeds/feed", {feed: allFeed, users: allusers});
                }
            });
        }
    });
});


router.get("/feeds/new", middleware.isLoggedIn, function(req,res){
    res.render("feeds/new");
});
router.post("/feeds", middleware.isLoggedIn, function(req,res){
    var title = req.body.title;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var NewFeed = {title: title, image: image, description: desc, author: author};
    Feed.create(NewFeed, function(err, newcreated){
        if(err){
            console.log(err);
        }else{
            res.redirect("/feeds");
        }
    });
});

router.get("/:id/edit", middleware.checkFeedOwnership, function(req,res){
    Feed.findById(req.params.id, function(err, foundFeed){
        if(err){
            console.log(err);
            res.redirect("back");
        }else{
            res.render("feeds/FeedEdit", {feed: foundFeed});
        }
    });
});
router.put("/:id", middleware.checkFeedOwnership, function(req,res){
    Feed.findByIdAndUpdate(req.params.id, req.body.feed, function(err, updatedFeed){
        if(err){
            console.log(err);
            res.redirect("back");
        }else{
            req.flash("success", "Post Updated Successfully");
            res.redirect("/feeds");
        }
    });
});
router.delete("/:id", middleware.checkFeedOwnership, function(req,res){
    Feed.findByIdAndRemove(req.params.id, function(err){
        if(err){
            console.log(err);
            res.redirect("back");
        }else{
            req.flash("error", "Post Deleted Successfully");
            res.redirect("/feeds");
        }
    });
});

module.exports = router;