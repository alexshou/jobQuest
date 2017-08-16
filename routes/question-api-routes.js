// *********************************************************************************
// api-routes.js - this file offers a set of routes for displaying and saving data to the db
// *********************************************************************************

// Dependencies
// =============================================================

// Requiring our models
var db = require("../models");

// Routes
// =============================================================
module.exports = function(app) {

  // GET route for getting all of the questions
  app.get("/api/questions", function(req, res) {
    var query = {};
    if (req.query.category_id) {
      query.CategoryId = req.query.category_id;
    }
    // Here we add an "include" property to our options in our findAll query
    // We set the value to an array of the models we want to include in a left outer join
    // In this case, just db.Category
    db.Question.findAll({
      where: query,
      include: [db.Category]
    }).then(function(dbQuestion) {
      res.json(dbQuestion);
    });
  });

  // Get rotue for retrieving a single post
  app.get("/api/questions/:id", function(req, res) {
    // Here we add an "include" property to our options in our findOne query
    // We set the value to an array of the models we want to include in a left outer join
    // In this case, just db.Category
    db.Question.findOne({
      where: {
        id: req.params.id
      },
      include: [db.Category]
    }).then(function(dbQuestion) {
      res.json(dbQuestion);
    });
  });

  // POST route for saving a new post
  app.post("/api/questions", function(req, res) {
    db.Question.create(req.body).then(function(dbQuestion) {
      res.json(dbQuestion);
    });
  });

  // DELETE route for deleting questions
  app.delete("/api/questions/:id", function(req, res) {
    db.Question.destroy({
      where: {
        id: req.params.id
      }
    }).then(function(dbQuestion) {
      res.json(dbQuestion);
    });
  });

  // PUT route for updating questions
  app.put("/api/questions", function(req, res) {
    db.Question.update(
      req.body,
      {
        where: {
          id: req.body.id
        }
      }).then(function(dbQuestion) {
        res.json(dbQuestion);
      });
  });
};
