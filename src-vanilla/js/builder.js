const Builder = {
  buildTasks(data) {

    let divArray = [];

    data.forEach((el)=>{

      const div = document.createElement("div"),
            input = document.createElement("input"),
            label = document.createElement("label"),
            button = document.createElement("button");

      div.className = "flex row";
      input.type = "checkbox";
      input.className = "checkbox";
      label.innerHTML = el.text;
      button.className = "remove";
      button.innerHTML = "X";

      div.append(input, label, button);
      divArray.push(div);
    })

    return divArray;
  },

  buildFilters(data) {
    const div = document.createElement("div"),
          span = document.createElement("div"),
          ul = document.createElement("div"),
          li1 = document.createElement("div"),
          li2 = document.createElement("div"),
          li3 = document.createElement("div"),
          button = document.createElement("button");

    div.className = "flex row";
    span.innerHTML = "XYZ Tasks Left";
    ul.className = "filters flex row";
    li1.innerHTML = "All";
    li2.innerHTML = "Active";
    li3.innerHTML = "Completed";
    button.innerHTML = "Clear Completed";

    ul.append(li1, li2, li3);
    div.append(span, ul, button);

    return div;
  }
}

export default Builder;
