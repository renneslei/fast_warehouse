var express = require("express");
var router = express.Router({mergeParams:true});
var middleware = require("../middleware");

//grab dagta
var Package = require("../models/package");
var Comment = require("../models/comment");

//Comment New
router.get("/new", middleware.isLoggedIn, function(req, res){
	//find package by id  
	Package.findById(req.params.id, function(err, package){
		if(err){
			console.log(err);
		} else {
			res.render("comments/new", {package: package});
		}
	});
});

//Comment Create
router.post("/", middleware.isLoggedIn, function(req,res){
	Package.findById(req.params.id, function(err, package){
		if(err){
			console.log(err);
		} else {
			Comment.create(req.body.comment, function(err, comment){
				if(err){
					console.log(err);
				} else {
					//add username and id to comment
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					//save comment
					comment.save();
					package.comments.push(comment);
					package.save();
					req.flash("success", "成功添加评论");
					res.redirect("/packages/" + package._id);
				}
			});
		}
	})
});

//edit
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
	Package.findById(req.params.id, function(err, foundPackage){
		if(err || !foundPackage){
			req.flash("error", "找不到相关记录");
			res.redirect("back");
		}; 
		Comment.findById(req.params.comment_id, function(err, foundComment){
		if(err){
			res.redirect("back");
		}else{
			res.render("comments/edit", {package_id: req.params.id, comment: foundComment });
		}	
		});
	});	
});

//update
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    // find and update the correct campground
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
       if(err){
           res.redirect("back");
       } else {
           //redirect somewhere(show page)
		   req.flash("success", "成功修改评论");
           res.redirect("/packages/" + req.params.id);
       }
    });
});

//destroy
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
	Comment.findByIdAndRemove(req.params.comment_id, function(err){
		if(err){
			res.redirect("back");
		}else{
			req.flash("success", "成功删除评论");
			res.redirect("/packages/"+ req.params.id);
		}
	})
})

module.exports = router