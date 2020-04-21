var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user"); 
var middleware = require("../middleware");

//root routes
router.get("/", function(req,res){
	res.render("landing");
});

//auth Routes
router.get("/register", function(req, res){
	res.render("register");
});

//handle sign up logic
router.post("/register", function(req,res){
	var newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, function(err, user){
		if(err){
			req.flash("error", err.message);
			return res.render("register");
		}
		passport.authenticate("local")(req, res, function(){
			res.redirect("/packages");
		});
	} );
});
 
//show login form
router.get("/login", function(req, res){
	res.render("login");
});

//handling login logic
router.post("/login", passport.authenticate("local", 
	 {
		successRedirect: "/packages",
		failureRedirect:"/login"
	}), function(req, res){
});

//logout route
router.get("/logout", function(req, res){
	req.logout();
	req.flash("success", "成功退出");
	res.redirect("/packages")   
});

module.exports = router;