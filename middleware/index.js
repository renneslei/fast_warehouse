var Package = require("../models/package");
var Comment = require("../models/comment");

var middlewareObj = {};

middlewareObj.checkPackageOwnership = function(req, res, next){
	if(req.isAuthenticated()){
		Package.findById(req.params.id, function(err, foundPackage){
			if(err || !foundPackage){
				req.flash("error", "找不到相关记录");
				res.redirect("back");
			} else{
				if(foundPackage.author.id.equals(req.user._id)){
					next();
				}else{
					req.flash("error", "你没有相关权限");
					res.redirect("back");
				}
			}
		});	
	}else{
		req.flash("error", "请先登录");
		res.redirect("back");
	}
}

middlewareObj.checkCommentOwnership = function(req, res, next){
	if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id, function(err, foundComment){
			if(err){
				req.flash("error", "找不到相关记录");
				res.redirect("back");
			} else{
				if(foundComment.author.id.equals(req.user._id)){
					next();
				}else{
					req.flash("error", "你没有相关权限");
					res.redirect("back");
				}
			}
		});	
	}else{
		req.flash("error", "请先登录");
		res.redirect("back");
	}
} 

middlewareObj.isLoggedIn = function(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error", "请先登录");
	res.redirect("/login");
}

module.exports = middlewareObj;