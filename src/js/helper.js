const Helpers = {
  identicalStatus(data) {
    for (var i = 0; i < data.length - 1; i++) {
      if (data[i].status !== data[i + 1].status) {
        return {identical: false, value: null};
      }
    }
    return {identical: true, value: data[0].status};
  },

  addClass(element, className) {
    let arr = element.className.split(" ");
    if (arr.indexOf(className) == -1) {
        element.className += " " + className;
    }
  },

  removeClass(element, className) {
      element.className = element.className.replace(className, "");
  },

  toggleClass(element, className) {
    if (element.classList) {
      element.classList.toggle(className);
    } else {
      // For IE9
      var classes = element.className.split(" ");
      var i = classes.indexOf(className);

      if (i >= 0)
        classes.splice(i, 1);
      else
        classes.push(className);
      element.className = classes.join(" ");
    }
  }

}
export default Helpers;
