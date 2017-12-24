var mongoose = require("mongoose");
var Blog = require("./models/blog.js");
var Comment = require("./models/comment.js");

var data =[
	{
		title:"MyFirstBlog",
		image:"images/i1.jpeg",
		body:"Te eum doming eirmod, nominati pertinacia argumentum ad his.Te eum doming eirmod, nominati pertinacia argumentum ad his. Ex eam alia facete scriptorem, est aute Ex eam alia facete scriptorem, est aute"
	},
	{
		title:"MySecondBlog",
		image:"images/i1.jpeg",
		body:"Te eum doming eirmod, nominati pertinacia argumentum ad his.Te eum doming eirmod, nominati pertinacia argumentum ad his. Ex eam alia facete scriptorem, est aute Ex eam alia facete scriptorem, est aute"
	},
	{
		title:"MyThirdBlog",
		image:"images/i1.jpeg",
		body:"Te eum doming eirmod, nominati pertinacia argumentum ad his.Te eum doming eirmod, nominati pertinacia argumentum ad his. Ex eam alia facete scriptorem, est aute Ex eam alia facete scriptorem, est aute"
	}
];

function seedDb(){
	Comment.remove({},function(err){
		if(err){
			console.log("err while removing all comments");
		}
	});

	Blog.remove({},function(err){
		if(err){
			console.log("ERROR OCCURED WHILE REMOVING ALL");
		}

		else{

			data.forEach(function(blog){
				Blog.create(blog,function(err,blog){
					if(err){
						console.log("Err while creating blog!!!");
					}
					else{
						//console.log("Blog Created");
						// console.log(blog);
						var comment = {
							author:"Kalpit",
							text:"This is the first comment made by me"
						}
						Comment.create(comment,function(err,comment){
							if(err){
								console.log("ERR occured while creating comment");
							}
							else{
								//console.log(blog);
								//console.log(blog.comments);
								blog.comments = blog.comments.concat([comment]);
								blog.save(function(err,blog){
									if(err){
										console.log("err while save blog");
									}
									else{

									}
								});
							}
						});
					}
				});
			});			
		}
	});
}

module.exports = seedDb;