
//Purpose: For a given Data object, create DOM Elements

const Builder = {
  buildTasks(data) {

    let divArray = [];

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
        console.log(div + 'is completed');
      } else {
        input.checked = false;
        label.className = "";
        console.log(div + 'is incomplete');
      }

      div.append(input, label, button);
      divArray.push(div);
    })

    return divArray;
  }
}

export default Builder;
