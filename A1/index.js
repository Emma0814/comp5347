function getJsonObject(path, success, error) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                if (success) success(JSON.parse(xhr.responseText));
            } else {
                if (error) error(xhr);
            }
        }
    };
    xhr.open("GET", path, true);
    xhr.send();
}

// unselect all books
function clearSelection(){
  // selectedBooks = 0;
  for(var n = 0; n < titles.length; n++){
    var book = document.getElementsByTagName("tr")[n + 1];
    book.setAttribute("class", "non-selected");
  }
}

// un-hidden all books
function clearFilter(){
  for(var n = 0; n < categories.length; n++){
    var book = document.getElementsByTagName("tr")[n + 1];
    book.style.display = "table-row";
  }
}

// combine search
function complexSearch(){
  if(searchedTitle.toUpperCase().length == 0){
    // only do filter
    for(var m = 0; m < categories.length; m++){
      if(filteredCategory == "Category"){
        clearFilter();
      }else if(filteredCategory != categories[m]){
        var book = document.getElementsByTagName("tr")[m + 1];
        book.style.display = "none";
      }
    }
  }
  else if(filteredCategory == "Category"){
    // only do search
    for(var m = 0; m < upperTitles.length; m++){
      if(upperTitles[m].includes(searchedTitle.toUpperCase())){
        var book = document.getElementsByTagName("tr")[m + 1];
        book.setAttribute("class", "selected");
        selectedBooks++;
      }
    }
  }
  else{
    for(var m = 0; m < categories.length; m++){
      var book = document.getElementsByTagName("tr")[m + 1];
      if(filteredCategory == "Category" && upperTitles[m].includes(searchedTitle.toUpperCase())){
        book.setAttribute("class", "selected");
      }else{
        if(filteredCategory != categories[m]){
          book.style.display = "none";
        }else{
          if(upperTitles[m].includes(searchedTitle.toUpperCase())){
            book.setAttribute("class", "selected");
          }
          selectedBooks++;
        }
      }
    }
  }

  // no math
  if(selectedBooks.length == 0){
    alert("No book match");
  }
}

var data;
var titles = [];
var upperTitles = [];
var categories = [];
var selectedBooks = 0;
var cartNumber = 0;
var searchedTitle = "";
var filteredCategory = "Category";

window.onload = function(){
  getJsonObject("data.json", function(data){
    for(var i = 0; i < data.length; i++){

      // row
      var line = document.createElement("tr");
      var className = document.createAttribute("class");
      className.value = "non-selected";
      line.setAttributeNode(className);
      var className2 = document.createAttribute("class");
      className2.value = "books";
      line.setAttributeNode(className2);

      // checkbox
      var checkbox = document.createElement("input");
      var type = document.createAttribute("type");
      type.value = "checkbox";
      var className3 = document.createAttribute("class");
      className3.value = "tick";
      checkbox.setAttributeNode(type);
      checkbox.setAttributeNode(className3);
      var cell0 = document.createElement("td");
      cell0.appendChild(checkbox);
      line.appendChild(cell0);

      // img
      var picture = document.createElement("img");
      var src = document.createAttribute("src");
      src.value = data[i].img;
      var alt = document.createAttribute("alt");
      alt.value = data[i].title;
      var width = document.createAttribute("width");
      width.value = "50px";
      var height = document.createAttribute("height");
      height.value = "70px";
      picture.setAttributeNode(src);
      picture.setAttributeNode(alt);
      picture.setAttributeNode(width);
      picture.setAttributeNode(height);
      var cell1 = document.createElement("td");
      cell1.appendChild(picture);
      line.appendChild(cell1);

      // title
      var title = document.createElement("td");
      var node = document.createTextNode(data[i].title);
      title.appendChild(node);
      line.appendChild(title);
      titles[i] = data[i].title;
      upperTitles[i] = data[i].title.toUpperCase();

      // authors
      var authors = document.createElement("td");
      node = document.createTextNode(data[i].authors);
      authors.appendChild(node);
      line.appendChild(authors);

      // year
      var year = document.createElement("td");
      node = document.createTextNode(data[i].year);
      year.appendChild(node);
      line.appendChild(year);

      // price
      var price = document.createElement("td");
      node = document.createTextNode(data[i].price);
      price.appendChild(node);
      line.appendChild(price);

      // publisher
      var publisher = document.createElement("td");
      node = document.createTextNode(data[i].publisher);
      publisher.appendChild(node);
      line.appendChild(publisher);

      // category
      var category = document.createElement("td");
      node = document.createTextNode(data[i].category);
      category.appendChild(node);
      line.appendChild(category);
      categories[i] = data[i].category;

      var element = document.getElementsByTagName("tbody")[0];
      element.appendChild(line);
    }
  });
}

document.addEventListener("DOMContentLoaded", function(event){
  // search
  var search = document.getElementsByTagName("button")[0];
  if(search){
    search.addEventListener("click", function(){
      searchedTitle = document.getElementsByTagName("input")[0].value;
      if(searchedTitle.length == 0){
        clearSelection();
        alert("You should enter something.");
      }else{
        var match = false;
        for(var m = 0; m < upperTitles.length; m++){
          if(upperTitles[m].includes(searchedTitle.toUpperCase())){
            match = true;
            break;
          }
        }
        if(!match){
          clearSelection();
          alert("No book match");
        }else{
          clearSelection();
          complexSearch();
        }
      }
    });
  }

  // filter
  var filter = document.getElementById("filter");
  if(filter){
    filter.addEventListener("click", function(){
      var category = document.getElementsByTagName("select")[0];
      filteredCategory = category.options[category.selectedIndex].text;
      clearFilter();
      if(filteredCategory == "Computer"){
        for(var m = 0; m < 10; m++){
          var book = document.getElementsByTagName("tr")[m + 1];
          book.style.display = "none";
        }
      }else{
        clearSelection();
        complexSearch();
      }
    });
  }

  //  add to cart
  var add = document.getElementById("add");
  if(add){
    add.addEventListener("click", function(){
      /** Assume that we need to remain bg color after click reset/add button
          If we need to cancel bg color, please un-comment next line
      **/
      // clearSelection();
      var ticks = [];
      for(var m = 0; m < titles.length; m++){
        var tick = document.getElementsByClassName("tick")[m];
        if(tick.checked == true){
          cartNumber++;
          ticks.push(m);
        }
      }
      if(ticks.length == 0){
        alert("You did not choose any book");
      }else{
        alert("Added to Cart");
        for(var n = 0; n < ticks.length; n++){
          var tick = document.getElementsByClassName("tick")[ticks[n]];
          tick.checked = false;
        }
        var number = document.getElementById("cartNumber");
        number.innerHTML = "(" + cartNumber + ")";
      }
    });
  }

  // reset the cart
  var reset = document.getElementById("reset");
  if(reset){
    reset.addEventListener("click", function(){
      /** Assume that we need to remain bg color after click reset/add button
          If we need to cancel bg color, please un-comment next line
      **/
      // clearSelection();
      if(cartNumber == 0){
        alert("There is nothing in the cart.");
      }else{
        var box = document.getElementById("resetBox");
        box.style.display = "block";
        var confirm = document.getElementById("confirm");
        confirm.addEventListener("click", function(){
          var number = document.getElementById("cartNumber");
          number.innerHTML = "(0)";
          cartNumber = 0;
          box.style.display = "none";
        });
        var cancel = document.getElementById("cancel");
        cancel.addEventListener("click", function(){
          box.style.display = "none";
        });
      }
    });
  }
});
