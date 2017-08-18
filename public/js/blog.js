    const app = new Vue({
    el: "#app",
    data: {
      events: [
        
      ]
    }
  });

  const appCat = new Vue({
    el: "#appCat",
    data: {
      cats: [
        
      ]
    }
  });

$(document).ready(function() {
  /* global moment */

  // blogContainer holds all of our questions
  var blogContainer = $(".blog-container");
  var questionCategorySelect = $("#category");
  // Click events for the edit and delete buttons
  $(document).on("click", "button.delete", handleQuestionDelete);
  $(document).on("click", "button.edit", handleQuestionEdit);
  // Variable to hold our questions
  var questions;

  // The code below handles the case where we want to get question questions for a specific category
  // Looks for a query param in the url for category_id
  var url = window.location.search;
  var categoryId;
  if (url.indexOf("?category_id=") !== -1) {
    categoryId = url.split("=")[1];
    getQuestions(categoryId);
  }
  // If there's no categoryId we just get all questions as usual
  else {
    getQuestions();
  }
  // Getting the intiial list of categoris
  getCategories();
  function getCategories() {
    $.get("/api/categories", function(data) {
      var rowsToAdd = [];
      //renderCategoryListLeft(data);
      console.log(data);
      appCat.cats = data;
    });
  }
  // This function grabs questions from the database and updates the view
  function getQuestions(category) {
    categoryId = category || "";
    if (categoryId) {
      categoryId = "/?category_id=" + categoryId;
    }
    $.get("/api/questions" + categoryId, function(data) {
        console.log("Questions----------------------------------------------------", data);
      questions = data;
      console.log(data);
      if (!questions || !questions.length) {
        displayEmpty(category);
      }
      else {
        //initializeRows();
        app.events = questions;
      }
    });
  }

  // This function does an API call to delete questions
  function deleteQuestion(id) {
    $.ajax({
      method: "DELETE",
      url: "/api/questions/" + id
    })
    .done(function() {
      getQuestions(questionCategorySelect.val());
    });
  }

  // InitializeRows handles appending all of our constructed question HTML inside questionContainer
  function initializeRows() {
    blogContainer.empty();
    var questionsToAdd = [];
    for (var i = 0; i < questions.length; i++) {
      questionsToAdd.push(createNewRow(questions[i]));
    }
    blogContainer.append(questionsToAdd);
  }

  // This function constructs a question's HTML
  function createNewRow(question) {
    var formattedDate = new Date(question.createdAt);
    formattedDate = moment(formattedDate).format("MMMM Do YYYY, h:mm:ss a");
    var newQuestionPanel = $("<div>");
    newQuestionPanel.addClass("panel panel-default");
    var newQuestionPanelHeading = $("<div>");
    newQuestionPanelHeading.addClass("panel-heading");
    var deleteBtn = $("<button>");
    deleteBtn.text("x");
    deleteBtn.addClass("delete btn btn-danger");
    var editBtn = $("<button>");
    editBtn.text("EDIT");
    editBtn.addClass("edit btn btn-info");
    var newQuestionTitle = $("<h4>");
    var newQuestionDate = $("<small>");
    var newQuestionCategory = $("<h5>");
    var newQuestionAnswer = $("<div>");
    var newQuestionCompany = $("<button>");
    newQuestionCompany.addClass = ("btn btn-round btn-xs");
    newQuestionCategory.text("belongs to category: " + question.Category.name);
    newQuestionCategory.css({
      float: "right",
      color: "blue",
      "margin-top":
      "-10px"
    });
    var newQuestionPanelBody = $("<div>");
    newQuestionPanelBody.addClass("panel-body");
    var newQuestionBody = $("<p>");
    newQuestionTitle.text(question.title + " ");
    newQuestionBody.text("Question: " + question.body);
    newQuestionAnswer.text("Answer: " + question.answer);
    newQuestionCompany.text(question.company);
    newQuestionDate.text(formattedDate);
    newQuestionTitle.append(newQuestionDate);
    newQuestionPanelHeading.append(deleteBtn);
    newQuestionPanelHeading.append(editBtn);
    newQuestionPanelHeading.append(newQuestionTitle);
    newQuestionPanelHeading.append(newQuestionCategory);
    newQuestionPanelBody.append(newQuestionBody);
    newQuestionPanelBody.append(newQuestionAnswer);
    newQuestionPanelBody.append(newQuestionCompany);
    newQuestionPanel.append(newQuestionPanelHeading);
    newQuestionPanel.append(newQuestionPanelBody);
    newQuestionPanel.data("question", question);
    return newQuestionPanel;
  }

  // This function figures out which question we want to delete and then calls deleteQuestion
  function handleQuestionDelete() {
    var currentQuestion = $(this)
      .parent()
      .parent()
      .data("question");
    deleteQuestion(currentQuestion.id);
  }

  // This function figures out which question we want to edit and takes it to the appropriate url
  function handleQuestionEdit() {
    var currentQuestion = $(this)
      .parent()
      .parent()
      .data("question");
    window.location.href = "/cms?question_id=" + currentQuestion.id;
  }

  // This function displays a messgae when there are no questions
  function displayEmpty(id) {
    var query = window.location.search;
    var partial = "";
    if (id) {
      partial = " for category #" + id;
    }
    blogContainer.empty();
    var messageh2 = $("<h2>");
    messageh2.css({ "text-align": "center", "margin-top": "50px" });
    messageh2.html("No questions yet" + partial + ", navigate <a href='/cms" + query +
    "'>here</a> in order to get started.");
    blogContainer.append(messageh2);
  }

});
