// var db = require("../models");
var path = require("path");

var isAuthenticated = require("../config/middleware/isAuthenticated");
var isOwner = require("../config/middleware/isOwner");

module.exports = function (app) {
  // Load index page

  app.get("/dashboard",isAuthenticated, isOwner, function (req, res) {
    res.sendFile(path.join(__dirname, "../public/test/dashboard.html"));
  });
  app.get("/login", function(req, res){
    if (req.user) {
      res.redirect("/dashboard");
    }
    // res.render("login");
    res.render("../views/login.handlebars");
  });
  app.get("/signup", function(req, res){
    // res.render("signup");
    res.render("../views/signup.handlebars");
  });
  app.get("/", function(req, res){
    res.render("index");
  });
  // Load example page and pass in an example by id
  // app.get("/example/:id", function(req, res) {
  //   db.Example.findOne({ where: { id: req.params.id } }).then(function(dbExample) {
  //     res.render("example", {
  //       example: dbExample
  //     });
  //   });
  // });

  // Render 404 page for any unmatched routes
  app.get("*", function (req, res) {
    res.render("404");
  });
};