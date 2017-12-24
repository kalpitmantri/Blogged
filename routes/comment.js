var express = require("express");
var router = express.Router();

var Blog = require("../models/blog.js");
var Comment = require("../models/comment.js");
var User = require("../models/user.js");


router.post("/blogs/:id/comments",isLoggedIn,function(req,res){
	Blog.findById(req.params.id,function(err,blog){
		if(err){
			console.log(err);
			res.redirect("/blogs/"+ req.params.id +"/comments/new");
		}
		else{
			Comment.create(req.body.comment,function(err,comment){
				if(err){
					console.log(err);
					res.redirect("/blogs/"+ req.params.id +"/comments/new");
				}
				else{
					comment.author.username = req.user.username;
					comment.author.id = req.user._id;

					comment.save();

					blog.comments = blog.comments.concat([comment]);
					blog.save(function(err,blog){
						if(err){
							console.log(err);
							res.redirect("/blogs/"+ req.params.id +"/comments/new");
						}
						else{

						}
					});

					res.redirect("/blogs/" + req.params.id);
				}
			});
		}
	})
});

router.get("/blogs/:id/comments/:comment_id/edit",commentAuthorCheck,function(req,res){
	Comment.findById(req.params.comment_id,function(err,comment){
		res.render("comment/edit",{comment:comment,blogId:req.params.id});
	});
});

router.put("/blogs/:id/comments/:comment_id",commentAuthorCheck,function(req,res){
	Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,comment){
		if(err){
			console.log(err);
			res.redirect("/blogs/" + req.params.id);
		}
		else{
			console.log(comment);
			res.redirect("/blogs/" + req.params.id);
		}
	});	
});


router.delete("/blogs/:id/comments/:comment_id",commentAuthorCheck,function(req,res){
	Comment.findByIdAndRemove(req.params.comment_id,function(err){
		if(err){
			res.redirect("/blogs/"+req.params.id);
		}
		else{
			res.redirect("/blogs/"+req.params.id);
		}
	});
})

function isLoggedIn(req,res,next){
	if(req.isAuthenticated())
	{
		return next();
	}	

	res.redirect("/login");
}

function commentAuthorCheck(req,res,next){
	if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id,function(err,comment){
			if(err){
				res.redirect("back");
			}
			else{
				if(comment.author.id.equals(req.user._id)){
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


module.exports = router;