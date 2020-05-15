var express = require("express");
var router = express.Router();
var passport = require("passport");

var User = require("../models/user");

//=================
//Landing Route
//=================
router.get("/", function(req,res){
    res.render("landing");
});

//=================
//Home Route
//=================
router.get("/home", function(req,res){
    res.render("home");
});
//=================
//Register Route
//=================
router.get("/register", function(req,res){
    res.render("register");
});
router.post("/register", function(req,res){
    var newUser = new User({
        username: req.body.username,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        place: req.body.place,
        email: req.body.email,
        avatar: req.body.avatar
    });
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            res.redirect("/");
        }
        passport.authenticate("local")(req,res,function(){
            req.flash("success", "Successfully Registered as: " + req.body.username);
            res.redirect("/home");
        });
    });
});

//=================
//Login Route
//=================
router.get("/login", function(req,res){
    res.render("login");
});
router.post("/login", passport.authenticate("local", {
    successRedirect: "/home",
    failureRedirect: "/login"
}) ,function(req,res){});

//=================
//Logout Route
//=================
router.get("/logout", function(req,res){
    req.logout();
    req.flash("success", "Successfully Logged Out");
    res.redirect("/home");
});

module.exports = router;