const passport = require('passport');
const LocalStrategy  = require("passport-local").Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const keys = require('./keys');
const User = require('../models/user.js');


passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

passport.serializeUser((user,done)=>{
    done(null,user.id);
});

passport.deserializeUser((id,done)=>{
    User.findById(id).then((myuser)=>{
        done(null,myuser);
    });
});

passport.use(new LocalStrategy(User.authenticate()));

passport.use(
    new GoogleStrategy({
        // options for google strategy
        clientID: keys.google.clientID,
        clientSecret: keys.google.clientSecret,
        callbackURL: '/auth/google/redirect',
        passReqToCallback:true
    },(req,accessToken,refreshToken,profile,done) => {
         //check whether current user exist in database or not...
        if(!req.user){
            User.findOne({'google.gid':profile.id}).then((currentUser)=>{
                if(currentUser){
                    //User already exist
                    if(!currentUser.google.token){
                        currentUser.google.token = accessToken;
                        currentUser.google.token = accessToken;
                        currentUser.google.gname = profile.displayName;
                        currentUser.save(function(err){
                            if(err)
                                throw err;
                        });
                    }
                    console.log("CurrentUser: " + currentUser);
                    done(null,currentUser);
                }
                else{
                    //create new user        
                    new User({
                        'google.gname':profile.displayName,
                        'google.gid':profile.id,
                        'google.token':accessToken,
                        username:profile.displayName
                        // 'google.gender':gender
                    }).save().then((newUser) => {
                        console.log("New User Created : " + newUser);
                        done(null,newUser);
                    });          
                }
            }); 
        }

        else{
            var user = req.user;
            user.google.gid = profile.id;
            user.google.token = accessToken;
            user.google.gname = profile.displayName;

            user.save(function(err){
                if(err){
                    throw err;
                }
                else{
                    console.log("Google Linked");
                    return done(null,user);
                }
            });
        }   
    })
);

passport.use(
    new FacebookStrategy({
        clientID: keys.facebook.clientID,
        clientSecret: keys.facebook.clientSecret,
        callbackURL: 'http://localhost:3000/auth/facebook/callback',
        passReqToCallback:true
    },(req,accessToken,refreshToken,profile,done)=>{
        //console.log(profile);
        if(!req.user){
            User.findOne({'facebook.fbid':profile.id}).then((currentUser)=>{
                console.log(currentUser);
                if(currentUser){
                    if(!currentUser.facebook.token){
                        currentUser.facebook.token = accessToken;
                        currentUser.facebook.token = accessToken;
                        currentUser.facebook.gname = profile.displayName;
                        currentUser.save(function(err){
                            if(err)
                                throw err;
                        });
                    }
                    console.log("CurrentUser: " + currentUser);
                    done(null,currentUser);
                }
                else{
                    new User({
                        'facebook.fbid' : profile.id,
                        'facebook.token':accessToken,
                        //'facebook.email' : profile.emails[0].value,
                        'facebook.fbname' : profile.displayName,
                        username:profile.displayName
                    }).save().then((newUser) => {
                        console.log("New User Created : " + newUser);
                        done(null,newUser);
                    });
                }
            });
        }
        else{
            var user = req.user;
            user.facebook.fbid = profile.id;
            user.facebook.token = accessToken;
            user.facebook.fbname = profile.displayName;

            user.save(function(err){
                if(err){
                    throw err;
                }
                else{
                    console.log("Facebook Linked");
                    return done(null,user);
                }
            });
        }
        
    })
);