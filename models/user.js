var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

//schema setup
var UserSchema = new mongoose.Schema({
	username: String,
	password: String
});

UserSchema.plugin(passportLocalMongoose);

//compile that into a model
module.exports = mongoose.model("User", UserSchema);