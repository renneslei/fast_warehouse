var express          = require("express");
var app              =express();
var bodyParser       = require("body-parser");
var mongoose         = require("mongoose");
var flash			 = require("connect-flash");
var passport         = require("passport");
var LocalStrategy    = require("passport-local");
var methodOverride   = require("method-override");
var Package          = require("./models/package");
var Comment		     = require("./models/comment");
var User			 = require("./models/user");
var seedDB           = require("./seeds")

mongoose.connect(process.env.DATABASEURL, {useNewUrlParser: true, useUnifiedTopology: true});

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

//seed the database
// seedDB();
//requiring routes
var commentRoutes = require("./routes/comments");
var packageRoutes = require("./routes/packages");
var indexRoutes = require("./routes/index");

//PASSPORT CONFIGURATION
app.use(require("express-session")({
	secret: "Be Smart!",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//pass user data into all template, so that you can grab by calling for currentUser
app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error   = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

app.use("/", indexRoutes);
app.use("/packages", packageRoutes);
app.use("/packages/:id/comments",commentRoutes);


var port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log("Server started!");
});
