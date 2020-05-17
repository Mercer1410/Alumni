var express = require("express");
var router = express.Router();

var Feed = require("../models/feed");
var Comment = require("../models/comment");
var middleware = require("../middleware");

//=======================
//Comment Routes
//=======================
router.post("/:id/comment", middleware.isLoggedIn, function(req,res){
    Feed.findById(req.params.id, function(err, feed){
        if(err){
            console.log(err);
        }else{
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                }else{
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    feed.comment.push(comment);
                    feed.save();
                    req.flash("success", "Successfully added a comment");
                    res.redirect("/feeds");
                }
            });
        }
    });
});

router.get("/:id/comment/:comment_id/edit", middleware.checkCommentOwnership, function(req,res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            console.log(err);
            res.redirect("back");
        }else{
            res.render("comments/CommentEdit", {feed_id: req.params.id, comment: foundComment});
        }
    });
});

router.put("/:id/comment/:comment_id", middleware.checkCommentOwnership, function(req,res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            console.log(err);
            res.redirect("back");
        }else{
            res.redirect("/feeds");
        }
    });
});

router.delete("/:id/comment/:comment_id", middleware.checkCommentOwnership, function(req,res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            console.log(err);
            res.redirect("back");
        }else{
            req.flash("error", "Comment has been deleted");
            res.redirect("/feeds");
        }
    });
});
module.exports = router;