var express = require("express");
var router = express.Router();

var Blog = require("../models/blog.js");
var comment = require("../models/comment.js");
var User = require("../models/user.js");
var passport = require("passport");

router.get("/",function(req,res){
	res.redirect("/blogs");
});

router.get("/register",function(req,res){
	res.render("register");
});

router.post("/register",function(req,res){

	var newUser = new User({username:req.body.username});
	User.register(newUser,req.body.password,function(err,user){
		if(err){
			console.log(err);
			return res.render("register");
		}

		passport.authenticate("local")(req,res,function(){
			res.redirect("/blogs");
		});
	});
});

router.get("/loggedUser",function(req,res){
	res.redirect("/secret/"+req.user._id)
});

router.get("/secret/:user_id",isLoggedIn,function(req,res){
	User.findById(req.params.user_id).populate("blogs").exec(function(err,user){
		if(err){
			console.log(err);
			res.redirect("/blogs");
		}else{
			res.render("secret",{user:user});
		}
	});
});

router.get("/login",function(req,res){
	res.render("login");
});

router.post("/login",passport.authenticate("local",{
	successRedirect:"/loggedUser",
	failureRedirect:"/register"
}),function(req,res){
	console.log("Logged in");
});

router.get("/logout",function(req,res){
	req.logout();
	res.redirect("/blogs");
});

function isLoggedIn(req,res,next){
	if(req.isAuthenticated())
	{
		return next();
	}	

	res.redirect("/login");
}

module.exports = router;