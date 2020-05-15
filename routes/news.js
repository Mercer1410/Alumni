var express = require("express");
var router = express.Router();

var User = require("../models/user");
var New = require("../models/news");
var middleware = require("../middleware");

//=================
//News Routes
//=================
router.get("/users/:id/news/new", middleware.isLoggedIn, function(req,res){
    User.findById(req.params.id, function(err, user){
        if(err){
            console.log(err);
        }else{
            res.render("news/NewsNew", {user: user});
        }
    });
});
router.post("/users/:id/news", middleware.isLoggedIn, function(req,res){
    User.findById(req.params.id, function(err, user){
        if(err){
            console.log(err);
        }else{
            New.create(req.body.news, function(err, news){
                if(err){
                    console.log(err);
                }else{
                    news.author.id = user._id;
                    news.author.username = user.username;
                    news.save();
                    user.news.push(news);
                    user.save();
                    req.flash("success", "Successfully Added News About User");
                    res.redirect("/feeds");
                }
            });
        }
    });
});

router.get("/users/:id/news/:news_id/edit", middleware.newsOwnership, function(req,res){
    New.findById(req.params.news_id, function(err, foundNews){
        if(err){
            console.log(err);
            res.redirect("back");
        }else{
            res.render("news/NewsEdit", {user_id: req.params.id, news: foundNews});
        }
    });
});

router.put("/users/:id/news/:news_id", middleware.newsOwnership, function(req,res){
    New.findByIdAndUpdate(req.params.news_id, req.body.news, function(err, updatedNews){
        if(err){
            console.log(err);
            res.redirect("back");
        }else{
            req.flash("success", "News Updated Successfully!!");
            res.redirect("/home");
        }
    });
});

router.delete("/users/:id/news/:news_id", middleware.newsOwnership, function(req,res){
    New.findByIdAndRemove(req.params.news_id, function(err){
        if(err){
            console.log(err);
            res.redirect("back");
        }else{
            req.flash("error", "News has been deleted");
            res.redirect("/feeds");
        }
    });
});

module.exports = router;