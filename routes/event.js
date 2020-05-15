var express = require("express");
var router = express.Router();

var Event = require("../models/event");
var User = require("../models/user");
var middleware = require("../middleware");

//==================================
//EVENTS ROUTES
//==================================
router.get("/users/:id/events", middleware.isLoggedIn, function(req,res){
    Event.find({}, function(err, allevents){
        if(err){
            console.log(err);
            res.redirect("back");
        }else{
            res.render("events/Events", {events: allevents});
        }
    });
});

router.get("/users/:id/events/new", middleware.isLoggedIn, function(req,res){
    User.findById(req.params.id, function(err, user){
        if(err){
            console.log(err);
        }else{
            res.render("events/EventNew", {user: user});
        }
    });
});
router.post("/users/:id/events", middleware.isLoggedIn, function(req,res){
    User.findById(req.params.id, function(err, user){
        if(err){
            console.log(err);
        }else{
            Event.create(req.body.event, function(err, event){
                if(err){
                    console.log(err);
                }else{
                    event.author.id = user._id;
                    event.author.username = user.username;
                    event.save();
                    user.events.push(event);
                    user.save();
                    req.flash("success", "Successfully Added An Event");
                    res.redirect("/feeds");
                }
            });
        }
    });
});

router.get("/users/:id/events/:event_id/edit", middleware.eventOwnership, function(req,res){
    Event.findById(req.params.event_id, function(err, foundEvent){
        if(err){
            console.log(err);
            res.redirect("back");
        }else{
            res.render("events/EventEdit", {user_id: req.params.id, event: foundEvent});
        }
    });
});

router.put("/users/:id/events/:event_id", middleware.eventOwnership, function(req,res){
    Event.findByIdAndUpdate(req.params.event_id, req.body.event, function(err, updatedEvent){
        if(err){
            console.log(err);
            res.redirect("back");
        }else{
            req.flash("success", "Event Updated Successfully!!");
            res.redirect("/home");
        }
    });
});

router.delete("/users/:id/events/:event_id", middleware.eventOwnership, function(req,res){
    Event.findByIdAndRemove(req.params.event_id, function(err){
        if(err){
            console.log(err);
            res.redirect("back");
        }else{
            req.flash("error", "Event has been deleted");
            res.redirect("/feeds");
        }
    });
});

module.exports = router;