var href = window.location.href.split("/").pop();

document.querySelector("[href='" + href + "']").parentNode.className += " active";
