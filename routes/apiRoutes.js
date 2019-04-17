var db = require("../models");
var passport = require("../config/passport");
var isAuthenticated = require("../config/middleware/isAuthenticated");
var isOwner = require("../config/middleware/isOwner");

module.exports = function (app) {
  // Get all examples
  app.get("/api/pets", isAuthenticated, isOwner, function (req, res) {
    db.owners.findAll({
      include: [db.pets],
      where: { ownerEmail: req.user.email }
    }).then(function (view) {
      res.json(view);
    });
  });



  ////START OF AUTH APIS//////////////
  app.post("/api/login", passport.authenticate("local"), function (req, res) {
    res.json("/dashboard");
  });

  // Auth // Signup - new user creation - 
  app.post("/api/signup", function (req, res) {
    db.users.create({
      email: req.body.email,
      password: req.body.password,
      owner: true
    }).then(function () {
      console.log("create ran");
      // res.json("success");
      res.redirect(307, "/api/login");
    }).catch(function (err) {
      console.log(err);
      res.json(err);
    });
  });

  // Auth // Logout
  app.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/");
  });

  function immunizations(req, callback){
    switch (req.body.petType){
    case "dog":
      db.dogImmunizations.findOne({
        where: 
        {
          id: 1
        }
      }).then(function(view){
        console.log(view);
        req.body.immunizations = view;
        //REMEMBER TO UPDATE THIS ONE AS WELL OR THIS WILL MESS UP
        //stringify and stuff
      });
      break;
    case "cat":
      db.catImmunizations.findOne({
        where: 
      {
        id: 1
      }
      }).then(function(view){
        var string = JSON.stringify(Object.keys(view.dataValues));
        string = string.replace(/\/|\[|"/g, "");
        console.log(string);
        req.body.immunizations = string;
      });
      break;
    }
    return callback(req);
  }

  app.post("/api/pets", function (req, res) {
    db.owners.findOne({
      where: {
        ownerEmail: "again@email.com"
        // req.user.email,
      }
    }).then(function (view) {
      // console.log(view);
      req.body.ownerOwnerId = 1;

      db.pets.create(req.body).then(function (result) {
        console.log(result.dataValues.petId);
        // db.catImmunizations.create({
        //   petPetId: result.dataValues.petId
        // }).then(function(result){
        //   return result;
        // });
        switch(result.dataValues.petType){
        case "dog":
          db.dogImmunizations.create({
            petPetId: result.dataValues.petId
          });
          break;
        case "cat":
          db.catImmunizations.create({
            petPetId: result.dataValues.petId
          }).then(function(result){
            console.log(result);
            console.log("catimmun");
          });
          break;
        }
        // result.dataValues.immunization = JSON.stringify(newResult());
        res.json(result);
      });
    });
   


    //   // Delete an example by id
    //   app.delete("/api/pet/:id", function(req, res) {
    //     db.pets.destroy({ where: { id: req.params.id } }).then(function(result) {
    //       res.json(result);
    //     });
    //   });
    // };
    
  });
  app.delete("/api/pets/:id", function(req, res) {
    db.pets.destroy({ where: {petId: req.params.id}}).then(function(result) {
      res.json(result);
    });
  });
  app.put("/api/pets/:id", function(req,res) {
    console.log("WTF");
    db.pets.update(req.body,{
      where: {petId: req.params.id}
    }).then(function(result){
      res.json(result);
    });
  });
};