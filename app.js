var express = require("express");
var app = express();

var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var methodOverride = require("method-override");
var expressSanitizer = require("express-sanitizer");


var Comment = require("./models/comment.js");
var Blog = require("./models/blog.js");
var User = require("./models/user.js");
var seedDB = require("./seeder.js");

var keys = require('./config/keys.js');
var cookieSession = require('cookie-session');
var passport = require('passport');
var passportSetup = require('./config/passport-setup.js');

app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(expressSanitizer());
app.use(function(req,res,next){
	res.locals.currentUser = req.user;
	next();
});

var commentRoute    = require("./routes/comment"),
	blogRoute 		= require("./routes/blog"),
	indexRoute      = require("./routes/index");
	//authRoutes      = require("./routes/auth");

mongoose.connect("mongodb://localhost/blog_app",{
	useMongoClient:true
});

app.use(commentRoute);
app.use(blogRoute);
app.use(indexRoute);
//app.use(authRoutes);

// seedDB();

app.listen(3000,function(){
	console.log("Server is Listening");
});



