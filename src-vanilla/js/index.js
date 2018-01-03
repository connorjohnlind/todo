// TO DO APP
const App = {

  data: [],

  init() {
    this.cacheDom();
    this.bindEvents();
    this.render(); },

  cacheDom() {
    this.taskInput = document.querySelector('input.new-task');
    this.taskList = document.querySelector('div.task-list');
  },

  bindEvents() {

    this.taskInput.addEventListener("focus", ()=>{
      //this.taskInput.blur();
    });

    this.taskInput.addEventListener("keypress", ()=>{
      if (event.which == 13 || event.keyCode == 13){
        this.addTask(this.taskInput.value);
        this.taskInput.value = "";
      }
    });
  },

  render() {
    this.taskList.innerHTML = "";
    this.data.forEach((el)=>{
      const div = document.createElement("div");
      div.innerHTML = el.text;
      this.taskList.append(div);
    })
  },

  addTask(value) {
    this.data.push({text: value, completed: false});
    this.render();
  },

  removeTask(){
  },

};

App.init();
