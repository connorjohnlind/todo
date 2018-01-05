// Purpose: For a given data object and filter, create DOM Elements

const Builder = {
  buildTasks(data, filterState) {

    let divArray = [];

    if (filterState==="active") {
      data = data.filter((el)=>{
        return el.completed === false;
      });
    } else if (filterState==="completed") {
      data = data.filter((el)=>{
        return el.completed === true;
      });
    }

    data.forEach((el)=>{

      const div = document.createElement("div"),        // wrapper
            checkbox = document.createElement("input"),    // checkbox
            span = document.createElement("span"),      // task text
            input = document.createElement("input"),    // task editing
            button = document.createElement("button");  // remove button

      div.className = "task flex row";
      checkbox.type = "checkbox";
      checkbox.className = "checkbox";
      span.innerHTML = el.text;
      input.type = "text";
      input.innerHTML = el.text;
      input.className = "task-edit hidden";
      button.className = "remove invisible";
      button.innerHTML = "x";

      //state check
      if (el.completed) {
        checkbox.checked = true;
        span.className = "completed";
      } else {
        checkbox.checked = false;
        span.className = "";
      }

      div.append(checkbox, span, input, button);
      divArray.push(div);
    })

    return divArray;
  }
}

export default Builder;
