var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var userSchema = new mongoose.Schema({
	username:String,
	password:String,
	blogs:[
		{
			type:mongoose.Schema.Types.ObjectId,
			ref:"Blog"
		}
	],
	google:{
		gid:String,
		gender:String,
		token:String,
		gname:String
	},
	facebook:{
		fbid:String,
		token:String,
		fbname:String
	}
});

userSchema.plugin(passportLocalMongoose);

var User = mongoose.model("User",userSchema);

module.exports = User; 