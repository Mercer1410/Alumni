var express = require("express");
var router = express.Router();
var passport = require("passport");
var async = require("async");
var nodemailer = require("nodemailer");
var crypto = require("crypto");

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

//=================
//Forgot Password
//=================

router.get("/forgot", function(req,res){
    res.render("forgot");
});

router.post('/forgot', function(req, res, next) {
    async.waterfall([
      function(done) {
        crypto.randomBytes(20, function(err, buf) {
          var token = buf.toString('hex');
          done(err, token);
        });
      },
      function(token, done) {
        User.findOne({ email: req.body.email }, function(err, user) {
          if (!user) {
            req.flash('error', 'No account with that email address exists.');
            return res.redirect('/forgot');
          }
  
          user.resetPasswordToken = token;
          user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
  
          user.save(function(err) {
            done(err, token, user);
          });
        });
      },
      function(token, user, done) {
        res.redirect("/reset/"+token);
      }
    ], function(err) {
      if (err) {
          console.log(err);
        return next(err);
      }
      res.redirect('/forgot');
    });
  });
  
  router.get('/reset/:token', function(req, res) {
    User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
      if (!user) {
        req.flash('error', 'Password reset token is invalid or has expired.');
        return res.redirect('/forgot');
      }
      res.render('reset', {token: req.params.token});
    });
  });
  
  router.post('/reset/:token', function(req, res) {
    async.waterfall([
      function(done) {
        User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
          if (!user) {
            req.flash('error', 'Password reset token is invalid or has expired.');
            return res.redirect('back');
          }
          if(req.body.password === req.body.confirm) {
            user.setPassword(req.body.password, function(err) {
              user.resetPasswordToken = undefined;
              user.resetPasswordExpires = undefined;
  
              user.save(function(err) {
                req.flash("success", "Password has been successfully changed.");
                res.redirect("/home");
              });
            })
          } else {
              req.flash("error", "Passwords do not match.");
              return res.redirect('back');
          }
        });
      }
    ], function(err) {
      res.redirect('/home');
    });
  });

module.exports = router;