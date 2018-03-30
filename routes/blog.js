var express = require("express");
var router = express.Router();

var Blog = require("../models/blog.js");
var comment = require("../models/comment.js");
var User = require("../models/user.js");

router.get("/blogs",function(req,res){
	var noMatch;
	if(req.query.search){
		const regex = new RegExp(escapeRegex(req.query.search), 'gi');
		Blog.find({title:regex},function(err,blogs){
			if(err){
				console.log("Err While Finding!!!");
			}
			else{
				if(blogs.length<1){
					noMatch = "No Blog Matched, Try Again!!";
				}
				res.render("index",{blogs:blogs,noMatch:noMatch});
			}
		});
	}
	else{
		Blog.find({},function(err,blogs){
			if(err){
				console.log("Err While Finding!!!");
			}
			else{
				res.render("index",{blogs:blogs,noMatch:noMatch});
			}
		});
	}
});

router.get("/blogs/new",isLoggedIn,function(req,res){
	res.render("blog/new");
});

router.post("/blogs",isLoggedIn,function(req,res){

	req.body.body = req.sanitize(req.body.body);

	var title = req.body.title;
	var image = req.body.image;
	var body = req.body.body;
	var author = {
		id : req.user._id,
		username : req.user.username
	};
	var blog = {title:title,image:image,body:body,author:author};

	Blog.create(blog,function(err,newBlog){
		if(err){
			console.log("Err occured while Creating!!");
			res.redirect("/blogs/new")
		}
		else{

			req.user.blogs = req.user.blogs.concat([newBlog]);
			req.user.save();
			// console.log(newBlog);
			// console.log(req.user);
			res.redirect("/blogs");
		}
	});
});

router.get("/blogs/:id",function(req,res){

	var id = req.params.id;

	Blog.findById(id).populate("comments").exec(function(err,foundBlog){
		if(err){
			console.log("Err while founding by id");
			res.redirect("/blogs");
		}
		else
		{
			res.render("blog/show",{blog:foundBlog,blog_id:req.params.id});
		}
	});
});

router.get("/blogs/:id/edit",blogAuthorCheck,function(req,res){
		
	Blog.findById(req.params.id,function(err,blog){
		res.render("blog/edit",{blog:blog});
	});
	
});

router.put("/blogs/:id",blogAuthorCheck,function(req,res){
	req.body.blog.body = req.sanitize(req.body.blog.body);
	Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updatedBlog){
		if(err){
			console.log("Error Occoured");
			res.redirect("/blogs");
		}
		else{
			res.redirect("/blogs/" + req.params.id);
		}
	});
});

router.delete("/blogs/:id",blogAuthorCheck,function(req,res){
	Blog.findByIdAndRemove(req.params.id,function(err){
		if(err){
			console.log("Err occoured");
			res.redirect("/blogs");
		}
		else{
			res.redirect("/blogs");
		}
	})
});

function isLoggedIn(req,res,next){
	if(req.isAuthenticated())
	{
		return next();
	}	

	res.redirect("/login");
}

function blogAuthorCheck(req,res,next){
	if(req.isAuthenticated()){
		Blog.findById(req.params.id,function(err,blog){
			if(err){
				res.redirect("back");
			}
			else{
				if(blog.author.id.equals(req.user._id)){
					next();
				}else{
					res.redirect("back");
				}	
			}
		});
	}else{
		res.redirect("back");
	}
}

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports = router;

