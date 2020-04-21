var mongoose = require("mongoose");

//schema setup
var commentSchema = new mongoose.Schema({
	text: String,
	author: {
		id:{
			type: mongoose.Schema.Types.ObjectId,
			ref:"User"
		},
		username: String
	}
});
//compile that into a model
module.exports = mongoose.model("Comment", commentSchema);