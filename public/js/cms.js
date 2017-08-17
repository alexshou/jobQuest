  const appCat = new Vue({
    el: "#appCat",
    data: {
      cats: [
        
      ]
    }
  });

  const appSearch = new Vue({
    el: "#appSearch",
    data: {
      searches: [
        
      ]
    }
  });

$(document).ready(function() {
  // Getting jQuery references to the question body, title, form, and category select
  var bodyInput = $("#body");
  var titleInput = $("#title");
  var answerInput = $("#answer");
  var companyInput = $("#company");
  var cmsForm = $("#cms");
  var cmsSearch = $("#cms-search");
  var categorySelect = $("#category");
  var searchInput = $('#searchInput')
  // Adding an event listener for when the form is submitted
  $(cmsForm).on("submit", handleFormSubmit);
  $(cmsSearch).on("submit", handleSearch);
  // Gets the part of the url that comes after the "?" (which we have if we're updating a question)
  var url = window.location.search;
  var questionId;
  var categoryId;
  // Sets a flag for whether or not we're updating a question to be false initially
  var updating = false;

  // If we have this section in our url, we pull out the question id from the url
  // In '?question_id=1', questionId is 1
  if (url.indexOf("?question_id=") !== -1) {
    questionId = url.split("=")[1];
    getQuestionData(questionId, "question");
  }
  // Otherwise if we have an category_id in our url, preset the category select box to be our Category
  else if (url.indexOf("?category_id=") !== -1) {
    categoryId = url.split("=")[1];
  }

  // Getting the categories, and their questions
  getCategories();
  getCategoriesVue();
  function getCategoriesVue() {
    $.get("/api/categories", function(data) {
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
      if (!questions || !questions.length) {
        displayEmpty(category);
      }
      else {
        //initializeRows();
        app.events = questions;
      }
    });
  }

  function handleFormSubmit(event) {
    event.preventDefault();
    // Wont submit the question if we are missing a body, title, or category
    if (!titleInput.val().trim() || !bodyInput.val().trim() || !categorySelect.val() ||
        !answerInput.val().trim() || !companyInput.val().trim()) {
      return;
    }
    // Constructing a newQuestion object to hand to the database
    var newQuestion = {
      title: titleInput
        .val(),
      body: bodyInput
        .val(),        
      answer: answerInput
        .val(),
      company: companyInput
        .val(),
      CategoryId: categorySelect.val()
    };

    // If we're updating a question run updateQuestion to update a question
    // Otherwise run submitQuestion to create a whole new question
    if (updating) {
      newQuestion.id = questionId;
      updateQuestion(newQuestion);
    }
    else {
      submitQuestion(newQuestion);
    }
  }
  // A function for handling what happens when the form to create a new question is submitted
  function handleSearch(event) {
    console.log("search debug");
    event.preventDefault();
    // Wont submit the question if we are missing a body, title, or category
    if (!searchInput.val().trim()) {
      return;
    }
    // Constructing a newQuestion object to hand to the database
    var newSearch = searchInput.val().trim();
    $.get("/api/questions", function(data){
        var searchResults = [];
        for (var i = 0; i < data.length; i++) {
            if(data[i].company.toUpperCase() === newSearch.toUpperCase()) {
              searchResults.push(data[i]);
            }
         }
         console.log(data);
         console.log(searchResults);
         if(searchResults.length === 0) {
            alert("No results found. Please enter another company name. ")
         } else {
            appSearch.searches = searchResults;
         }
          //window.location.href = "/blog";
    });

  }

  // Submits a new question and brings user to question page upon completion
  function submitQuestion(question) {
    $.post("/api/questions", question, function() {
      window.location.href = "/blog";
    });
  }

  // Gets question data for the current question if we're editing, or if we're adding to an category's existing questions
  function getQuestionData(id, type) {
    var queryUrl;
    switch (type) {
      case "question":
        queryUrl = "/api/questions/" + id;
        break;
      case "category":
        queryUrl = "/api/categories/" + id;
        break;
      default:
        return;
    }
    $.get(queryUrl, function(data) {
      if (data) {
        console.log(data.CategoryId || data.id);
        // If this question exists, prefill our cms forms with its data
        titleInput.val(data.title);
        bodyInput.val(data.body);
        answerInput.val(data.body);
        companyInput.val(data.companyInput);
        categoryId = data.CategoryId || data.id;
        // If we have a question with this id, set a flag for us to know to update the question
        // when we hit submit
        updating = true;
      }
    });
  }

  // A function to get Categories and then render our list of Categories
  function getCategories() {
    $.get("/api/categories", renderCategoryList);
  }
  // Function to either render a list of categories, or if there are none, direct the user to the page
  // to create an category first
  function renderCategoryList(data) {
    if (!data.length) {
      window.location.href = "/categories";
    }
    $(".hidden").removeClass("hidden");
    var rowsToAdd = [];
    for (var i = 0; i < data.length; i++) {
      rowsToAdd.push(createCategoryRow(data[i]));
    }
    categorySelect.empty();
    categorySelect.append(rowsToAdd);
    categorySelect.val(categoryId);
  }

  // Creates the category options in the dropdown
  function createCategoryRow(category) {
    var listOption = $("<option>");
    listOption.attr("value", category.id);
    listOption.text(category.name);
    return listOption;
  }

  // Update a given question, bring user to the question page when done
  function updateQuestion(question) {
    $.ajax({
      method: "PUT",
      url: "/api/questions",
      data: question
    })
    .done(function() {
      window.location.href = "/blog";
    });
  }
});
