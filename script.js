var todos = [];
var filter = "all";
var KEY = "todos-v1";

try {
  todos = JSON.parse(localStorage.getItem(KEY)) || [];
} catch (e) {
  todos = [];
}

if (!Array.isArray(todos)) {
  todos = [];
}

// Save tasks to localStorage
function save() {

  try {
    localStorage.setItem(KEY, JSON.stringify(todos));
  } catch (e) {}

}


var list = document.getElementById("list");
var input = document.getElementById("in");


// Display tasks
function render() {

  var shown = todos.filter(function (t) {

    return (
      filter === "all" ||
      (filter === "done") === t.done
    );

  });


  list.innerHTML = "";


  // Show message when no tasks exist
  if (!shown.length) {

    var messages = {
      all: "No tasks yet. Add your first one above.",
      active: "Nothing left to do.",
      done: "No completed tasks yet."
    };

    list.innerHTML =
      '<li class="empty" style="display:block;border:0">' +
      messages[filter] +
      "</li>";
  }


  // Create each task
  shown.forEach(function (t) {

    var li = document.createElement("li");


    if (t.done) {
      li.className = "done";
    }

    // Checkbox
    var checkbox = document.createElement("input");

    checkbox.type = "checkbox";
    checkbox.checked = t.done;

    checkbox.setAttribute(
      "aria-label",
      "Mark done"
    );


    checkbox.onchange = function () {

      t.done = checkbox.checked;

      save();

      render();

    };

    // Task text
    var span = document.createElement("span");

    span.textContent = t.text;


    // Delete button
    var deleteButton = document.createElement("button");

    deleteButton.className = "del";

    deleteButton.innerHTML = "&times;";

    deleteButton.setAttribute(
      "aria-label",
      "Delete task"
    );

    deleteButton.onclick = function () {

      todos = todos.filter(function (x) {

        return x !== t;

      });

      save();

      render();

    };

    li.append(
      checkbox,
      span,
      deleteButton
    );

    list.appendChild(li);

  });

  // Count unfinished tasks
  var left = todos.filter(function (t) {

    return !t.done;

  }).length;

  document.getElementById("count").textContent =
    left +
    (left === 1 ? " task" : " tasks") +
    " left";


  // Show clear button only if completed tasks exist
  document.getElementById("clear").style.visibility =
    todos.some(function (t) {

      return t.done;

    })
      ? "visible"
      : "hidden";


  // Update filter buttons
  document
    .querySelectorAll(".tab")
    .forEach(function (button) {

      button.setAttribute(
        "aria-pressed",
        button.dataset.f === filter
      );

    });

}

function add() {

  var value = input.value.trim();
  if (!value) {
    return;
  }
  todos.push({
    text: value,
    done: false
  });

  input.value = "";
  save();

  render();


  input.focus();

}


document.getElementById("addBtn").onclick = add;


input.addEventListener("keydown", function (event) {

  if (event.key === "Enter") {

    add();

  }

});

document.getElementById("clear").onclick = function () {

  todos = todos.filter(function (t) {

    return !t.done;

  });


  save();

  render();

};

document
  .querySelectorAll(".tab")
  .forEach(function (button) {

    button.onclick = function () {

      filter = button.dataset.f;

      render();

    };

  });


render();