var express = require("express");
var router = express.Router();
var Package = require("../models/package");
var middleware = require("../middleware");


//Index show all packages
router.get("/", function(req,res){
	//get all packages from db
	Package.find({}, function(err, allPackages){
		if(err){
			console.log(err);
		} else{
			res.render("packages/index", {packages:allPackages});
		}
	});
});

//Create  add new package into database
router.post("/",  middleware.isLoggedIn, function(req,res){
	//get data from the form and add data into the array
	var id = req.body.id;
	var customer = req.body.customer;
	var tracking = req.body.tracking;
	var desc = req.body.description;
	var author = {
		id: req.user._id,
		username: req.user.username
	};
	var newPackage = {id:id, customer:customer, tracking:tracking, description:desc, author:author};
	//create a new package and save to the database
	Package.create(newPackage, function(err, newlycreated){
		if(err){
			console.log(err);
		} else{
			req.flash("success", "成功添加包裹");
			res.redirect("/packages");
		};
	});
});

//New show form to create new package
router.get("/new", middleware.isLoggedIn, function(req, res){
	res.render("packages/new");
});

//show page
router.get("/:id", function(req,res){
	Package.findById(req.params.id).populate("comments").exec(function(err, foundPackage){
		if(err || !foundPackage){
			req.flash("error", "找不到相关记录");
			res.redirect("back");
		}else{
			console.log(foundPackage);
			res.render("packages/show", {package: foundPackage});
		}
	});	
});

//edit
router.get("/:id/edit", middleware.checkPackageOwnership, function(req, res){
	Package.findById(req.params.id, function(err, foundPackage){
		res.render("packages/edit", {package:foundPackage});
	});	
});

//update
router.put("/:id", middleware.checkPackageOwnership, function(req, res){
    // find and update the correct campground
    Package.findByIdAndUpdate(req.params.id, req.body.package, function(err, updatedPackage){
       if(err){
           res.redirect("/packages");
       } else {
           //redirect somewhere(show page)
		   req.flash("success", "成功修改包裹");
           res.redirect("/packages/" + req.params.id);
       }
    });
});

//DESTROY
router.delete("/:id", middleware.checkPackageOwnership, function(req, res){
	Package.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/packages");
		}else{
			req.flash("success", "成功删除包裹");
			res.redirect("/packages");
		}
	})
});

module.exports = router;