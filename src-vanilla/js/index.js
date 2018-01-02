// TO DO APP
const App = {

  init() {
    this.cacheDom();
    this.bindEvents();
    this.render();
  },

  cacheDom() {
    this.taskInput = document.querySelector('input.task');
  },

  bindEvents() {

    this.taskInput.addEventListener("click", function() {
      console.log('this is ' + this);
      this.focus();
    });

    this.taskInput.addEventListener("keypress", function() {
      if (event.which === 13) {
        const div = document.createElement("div");
        div.innerHTML = this.value;
        this.parentNode.insertBefore(div, this.nextSibling);
        this.value = "";
      }
    });
  },

  render() {

  },

  addTask() {

  },

  removeTask(){

  },
};

App.init();
