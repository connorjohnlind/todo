// Purpose: For a given data object and filter, create DOM Elements

const Tasks = {
  build(data, filter) {

    let divArray = []; // Tasks expects an array from Datastore

    if (filter === "active") {
      data = data.filter( el=> {
        return el.status === false;
      });
    } else if (filter === "completed") {
      data = data.filter( el=> {
        return el.status === true;
      });
    }

    data.forEach( el=> {

      const div = document.createElement("div"), // wrapper
        checkbox = document.createElement("input"), // checkbox
        span = document.createElement("span"), // task text
        input = document.createElement("input"), // task editing
        button = document.createElement("button"); // remove button

      div.className = "task flex row";
      checkbox.type = "checkbox";
      checkbox.className = "task-checkbox";
      span.innerHTML = el.text;
      span.className = "task-span";
      input.type = "text";
      input.innerHTML = el.text;
      input.className = "task-edit hidden";
      button.className = "task-remove invisible";
      button.innerHTML = "x";

      //status check
      if (el.status) {
        checkbox.checked = true;
        span.className = "task-span completed";
      }
      div.append(checkbox, span, input, button);
      divArray.push(div);
    });

    console.log('task builder');
    return divArray;
  }
}

export default Tasks;
