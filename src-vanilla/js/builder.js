
//Purpose: For a given data object and filter, create DOM Elements

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

      const div = document.createElement("div"),
            input = document.createElement("input"),
            label = document.createElement("label"),
            button = document.createElement("button");

      div.className = "task flex row";
      input.type = "checkbox";
      input.className = "checkbox";
      label.innerHTML = el.text;
      button.className = "remove invisible";
      button.innerHTML = "x";

      //state check
      if (el.completed) {
        input.checked = true;
        label.className = "completed";
      } else {
        input.checked = false;
        label.className = "";
      }

      div.append(input, label, button);
      divArray.push(div);
    })

    return divArray;
  }
}

export default Builder;
