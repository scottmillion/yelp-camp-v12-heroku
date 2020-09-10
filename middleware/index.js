const Campground = require("../models/campground");
const Comment = require("../models/comment");


const middlewareObj = {};

middlewareObj.checkCampgroundOwnership = (req, res, next) => {
  if (req.isAuthenticated()) {
    Campground.findById(req.params.id, (err, foundCampground) => {
      if (err || !foundCampground) {
        req.flash("error", "Campground not found.");
        res.redirect("back");
      } else {
        // We use .equals() method from mongoose because foundCampground.author.id is an object and req.user._id is a string, so we can't use ===.
        if (foundCampground.author.id.equals(req.user._id)) {
          next();
        } else {
          req.flash("error", "You don't have permission to do that.");
          res.redirect("back");
        }
      }
    });

  } else {
    req.flash("error", "Oops! Please log in first.");
    res.redirect("back"); // takes them to previous page they were on.
  }
}

middlewareObj.checkCommentOwnership = (req, res, next) => {
  if (req.isAuthenticated()) {
    Comment.findById(req.params.comment_id, (err, foundComment) => {
      if (err || !foundComment) {
        req.flash("error", "Comment not found.");
        res.redirect("back");
      } else {
        // Added this block, to check if foundCampground exists, and if it doesn't to throw an error via connect-flash and send us back to the homepage. This is to fix crashing error discussed here: https://www.udemy.com/course/the-web-developer-bootcamp/learn/lecture/3861710#questions/2758358
        if (!foundComment) {
          req.flash("error", "Item not found.");
          return res.redirect("back");
        }
        // If the upper condition is true this will break out of the middleware and prevent the code below to crash our application
        //=================
        if (foundComment.author.id.equals(req.user._id)) {
          next();
        } else {
          req.flash("error", "You don't have permission to do that.");
          res.redirect("back");
        }
      }
    });

  } else {
    req.flash("error", "Oops! Please log in first.");
    res.redirect("back"); // takes them to previous page they were on.
  }
}

middlewareObj.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash("error", "Oops! Please log in first.");
  res.redirect("/login");
}

module.exports = middlewareObj;