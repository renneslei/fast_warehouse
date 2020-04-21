var mongoose = require("mongoose");
//schema setup
var packageSchema = new mongoose.Schema({
	id: String,
	customer: String,
	tracking: String,
	description: String,
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String
	},
	comments: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Comment"
		}

	]
});
//compile that into a model
module.exports = mongoose.model("Package", packageSchema);