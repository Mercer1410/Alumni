var express = require("express");
var router = express.Router();

var User = require("../models/user");
var Achieve = require("../models/achievement");
var middleware = require("../middleware");

//=================
//Achievement Routes
//=================
router.post("/users/:id/achievement", middleware.isLoggedIn, function(req,res){
    User.findById(req.params.id, function(err, user){
        if(err){
            console.log(err);
        }else{
            Achieve.create(req.body.achieve, function(err, achieve){
                if(err){
                    console.log(err);
                }else{
                    achieve.author.id = user._id;
                    achieve.author.username = user.username;
                    achieve.save();
                    user.achievement.push(achieve);
                    user.save();
                    req.flash("success", "Successfully Added an Achievement");
                    res.redirect("/feeds");
                }
            });
        }
    });
});

router.get("/users/:id/achievements/:achievement_id/edit", middleware.achievementOwnership, function(req,res){
    Achieve.findById(req.params.achievement_id, function(err, foundAchieve){
        if(err){
            console.log(err);
            res.redirect("back");
        }else{
            res.render("achievements/AchieveEdit", {user_id: req.params.id, achieve: foundAchieve});
        }
    });
});

router.put("/users/:id/achievements/:achievement_id", middleware.achievementOwnership, function(req,res){
    Achieve.findByIdAndUpdate(req.params.achievement_id, req.body.achieve, function(err, updatedAchieve){
        if(err){
            console.log(err);
            res.redirect("back");
        }else{
            req.flash("success", "Achievement Updated Successfully!!");
            res.redirect("/home");
        }
    });
});

router.delete("/users/:id/achievements/:achievement_id", middleware.achievementOwnership, function(req,res){
    Achieve.findByIdAndRemove(req.params.achievement_id, function(err){
        if(err){
            console.log(err);
            res.redirect("back");
        }else{
            req.flash("error", "Achievement has been deleted");
            res.redirect("/feeds");
        }
    });
});

module.exports = router;