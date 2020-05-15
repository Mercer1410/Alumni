var User = require("../models/user");
var New = require("../models/news");
var Feed = require("../models/feed");
var Event = require("../models/event");
var Comment = require("../models/comment");
var Achieve = require("../models/achievement");

var middlewareObj = {};

middlewareObj.isLoggedIn = function(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You are not Logged In");
    res.redirect("/login");
}

middlewareObj.checkFeedOwnership = function(req,res,next){
    if(req.isAuthenticated()){
        Feed.findById(req.params.id, function(err, foundFeed){
            if(err){
                req.flash("error", "Feed not Found");
                res.redirect("/home");
            }else{
                if(foundFeed.author.id.equals(req.user._id)){
                    next();
                }else{
                    req.flash("error", "You don't own this feed");
                    res.redirect("/home");
                }
            }
        });
    }else{
        req.flash("error", "You are not Logged In");
        res.redirect("/home");
    }
}

middlewareObj.checkCommentOwnership = function(req,res,next){
    if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id, function(err, foundComment){
			if(err){
				res.redirect("/home");
			}else{
				//does the user own the comment
				if(foundComment.author.id.equals(req.user._id)){
					next();
				}else{
                    req.flash("error", "You don't own this comment.");
					res.redirect("/home");
				}
			}
		});
	}else{
        req.flash("error", "You need to be Logged In to do that.");
		res.redirect("/home");
	}
}

middlewareObj.achievementOwnership = function(req,res,next){
    if(req.isAuthenticated()){
		Achieve.findById(req.params.achievement_id, function(err, foundAchieve){
			if(err){
				res.redirect("/home");
			}else{
				//does the user own the achievent
				if(foundAchieve.author.id.equals(req.user._id)){
					next();
				}else{
                    req.flash("error", "You don't own this Achievement");
					res.redirect("/home");
				}
			}
		});
	}else{
        req.flash("error", "You need to be Logged In to do that.");
		res.redirect("/home");
	}
}

middlewareObj.newsOwnership = function(req,res,next){
    if(req.isAuthenticated()){
		New.findById(req.params.news_id, function(err, foundNews){
			if(err){
				res.redirect("/home");
			}else{
				//does the user own the News
				if(foundNews.author.id.equals(req.user._id)){
					next();
				}else{
                    req.flash("error", "You don't own this News");
					res.redirect("/home");
				}
			}
		});
	}else{
        req.flash("error", "You need to be Logged In to do that.");
		res.redirect("/home");
	}
}

middlewareObj.eventOwnership = function(req,res,next){
    if(req.isAuthenticated()){
		Event.findById(req.params.event_id, function(err, foundEvent){
			if(err){
				res.redirect("/home");
			}else{
				//does the user own the event
				if(foundEvent.author.id.equals(req.user._id)){
					next();
				}else{
                    req.flash("error", "You don't own this Event");
					res.redirect("/home");
				}
			}
		});
	}else{
        req.flash("error", "You need to be Logged In to do that.");
		res.redirect("/home");
	}
}

middlewareObj.userOwnership = function(req,res,next){
    if(req.isAuthenticated()){
		User.findById(req.params.id, function(err, foundUser){
			if(err){
				res.redirect("/home");
			}else{
				if(foundUser._id.equals(req.user._id)){
					next();
				}else{
                    req.flash("error", "You are not the Right User");
					res.redirect("/home");
				}
			}
		});
	}else{
        req.flash("error", "You need to be Logged In to do that.");
		res.redirect("/home");
	}
}

module.exports = middlewareObj;