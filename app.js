var express               = require("express"),
    app                   = express(),
    bodyParser            = require("body-parser"),
    mongoose              = require("mongoose"),
    methodOverride        = require("method-override"),
    passport              = require("passport"),
    LocalStrategy         = require("passport-local"),
    flash                 = require("connect-flash");
    Achieve               = require("./models/achievement");
    Comment               = require("./models/comment");
    Event                 = require("./models/event");
    Feed                  = require("./models/feed");
    New                   = require("./models/news");
    User                  = require("./models/user");

var userRoute = require("./routes/user");
var newsRoute = require("./routes/news");
var indexRoute = require("./routes/index");
var feedRoute = require("./routes/feed");
var eventRoute = require("./routes/event");
var commentRoute = require("./routes/comment");
var achievementRoute = require("./routes/achievement");

var url = process.env.DATABASEURL || "mongodb://localhost/alumni";
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

//===================
//Passport Configuration
//===================
app.use(require("express-session")({
     secret: "I have no midle name",
     resave: false,
     saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    app.locals.moment = require('moment');
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

app.use(indexRoute);
app.use(feedRoute);
app.use(commentRoute);
app.use(userRoute);
app.use(achievementRoute);
app.use(newsRoute);
app.use(eventRoute);

app.listen(process.env.PORT || 3000, process.env.IP, function(){
    console.log("Alumni Server has Started.");
});