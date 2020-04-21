var mongoose = require("mongoose");
var Package = require("./models/package");
var Comment = require("./models/comment");

var data = [
	{
		id:"htt001", 
		customer:"james", 
		tracking:"1zdjfjkl322344",
		description: "可以在这里备注包裹的情况"
	},
	{
		id:"htt002", 
		customer:"lei", 
		tracking:"1zdjfjkl322344",
		description: "可以在这里备注包裹的情况"
	},
	{
		id:"htt003", 
		customer:"crystal", 
		tracking:"1zdjfjkl322344",
		description: "可以在这里备注包裹的情况"
	}
]


function seedDB(){
	//remove all packages
	Package.remove({}, function(err){
		if(err){
			console.log(err);
		}
		console.log("removed packages");
			// add a few packages
		data.forEach(function(seed){
			Package.create(seed, function(err, package){
				if(err){
					console.log(err);
				}else{
					console.log("added a package");
					// add a few comments
					Comment.create({
						text: "this place is great",
						author: "lei"
					}, function(err, comment){
						if(err){
							console.log(err);
						}else{
							package.comments.push(comment);
							package.save();
							console.log("create a new comment");
						}
					});
				}
			});
		});
	});	
};

module.exports = seedDB;