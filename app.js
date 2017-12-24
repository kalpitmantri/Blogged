var express = require("express");
var app = express();

var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var methodOverride = require("method-override");
var expressSanitizer = require("express-sanitizer");
var passport = require("passport");
var LocalStrategy  = require("passport-local").Strategy;

var Comment = require("./models/comment.js");
var Blog = require("./models/blog.js");
var User = require("./models/user.js");
var seedDB = require("./seeder.js");


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

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

var commentRoute    = require("./routes/comment"),
	blogRoute 		= require("./routes/blog"),
	indexRoute      = require("./routes/index");

mongoose.connect("mongodb://localhost/blog_app",{
	useMongoClient:true
});

app.use(commentRoute);
app.use(blogRoute);
app.use(indexRoute);

// seedDB();

//#################################################
//						ROUTES
//##################################################


app.listen(3000,function(){
	console.log("Server is Listening");
});



// Comment Routes
// app.get("/blogs/:id/comments/new",isLoggedIn,function(req,res){
	
// 	Blog.findById(req.params.id,function(err,foundBlog){
// 		if(err){
// 			console.log("Err in finding blog while commenting!!!");
// 			res.redirect("/blogs/" + req.params.id);
// 		}
// 		else{
// 			res.render("comment/new",{blog:foundBlog});
// 		}
// 	});
// });



