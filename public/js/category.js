    const appCat = new Vue({
    el: "#appCat",
    data: {
      cats: [
        
      ]
    }
  });

$(document).ready(function() {
  // Getting references to the category inout and category container, as well as the table body
  var nameInput = $("#category-name");
  var categoryList = $("tbody");
  var categoryContainer = $(".category-container");
  var categoryListLeft = $("ol");
  var categoryLeft = $(".category-left");
  // Adding event listeners to the form to create a new object, and the button to delete
  // a category
  $(document).on("submit", "#category-form", handleCategoryFormSubmit);
  $(document).on("click", ".delete-category", handleDeleteButtonPress);
 
  // Getting the intiial list of categoris
  getCategories();
  // A function to handle what happens when the form is submitted to create a new Author
  function handleCategoryFormSubmit(event) {
    event.preventDefault();
    // Don't do anything if the name fields hasn't been filled out
    if (!nameInput.val().trim().trim()) {
      console.log(nameInput);
      return;
    }
    // Calling the upsertCategory function and passing in the value of the name input
    upsertCategory({
      name: nameInput
        .val()
        .trim()
    });
  }

  // A function for creating an category. Calls getCategories upon completion
  function upsertCategory(categoryData) {
    $.post("/api/categories", categoryData)
      .then(getCategories);
  }

  // Function for creating a new list row for categories

  function createCategoryRow(categoryData) {
    var newTr = $("<tr>");
    newTr.data("category", categoryData);
    newTr.append("<td>" + categoryData.name + "</td>");
    newTr.append("<td> " + categoryData.Questions.length + "</td>");
    newTr.append("<td><a href='/blog?category_id=" + categoryData.id + "'>Go to questions</a></td>");
    newTr.append("<td><a href='/cms?category_id=" + categoryData.id + "'>Create a question</a></td>");
    newTr.append("<td><a style='cursor:pointer;color:red' class='delete-category'></a></td>");
    return newTr;
  }

  // Function for retrieving categories and getting them ready to be rendered to the page
  function getCategories() {
    $.get("/api/categories", function(data) {
      var rowsToAdd = [];
      for (var i = 0; i < data.length; i++) {
        rowsToAdd.push(createCategoryRow(data[i]));
      }
      renderCategoryList(rowsToAdd);
      //renderCategoryListLeft(data);
      console.log(data);
      appCat.cats = data;
      nameInput.val("");
    });
  }

  // A function for rendering the list of categories to the page
  function renderCategoryList(rows) {
    categoryList.children().not(":last").remove();
    categoryContainer.children(".alert").remove();
    if (rows.length) {
      console.log(rows);
      categoryList.prepend(rows);
    }
    else {
      renderEmpty();
    }
  }

  // Function for handling what to render when there are no categories
  function renderEmpty() {
    var alertDiv = $("<div>");
    alertDiv.addClass("alert alert-danger");
    alertDiv.html("You must create an Category before you can create a Question.");
    categoryContainer.append(alertDiv);
  }

  // Function for handling what happens when the delete button is pressed
  function handleDeleteButtonPress() {
    var listItemData = $(this).parent("td").parent("tr").data("category");
    var id = listItemData.id;
    $.ajax({
      method: "DELETE",
      url: "/api/categories/" + id
    })
    .done(getCategories);
  }
});
