import Builder from './builder.js';

// TO DO APP
const App = {

  data: [],

  init() {
    this.cacheDom();
    this.bindEvents();
    this.render(); },

  cacheDom() {
    this.taskInput = document.querySelector('input.task-input');
    this.taskList = document.querySelector('div.task-list');
  },

  bindEvents() {
    this.taskInput.addEventListener("keypress", ()=>{
      if (event.which == 13 || event.keyCode == 13){
        this.addTask(this.taskInput.value);
        this.taskInput.value = "";
      }
    });
  },

  render() {
    this.taskList.innerHTML = "";

    if (this.data.length > 0){
      let divArray = Builder.buildTasks(this.data);
      divArray.forEach((div)=>{this.taskList.append(div)});

      let div = Builder.buildFilters(this.data);
      this.taskList.append(div);
    };
  },

  addTask(value) {
    this.data.push({text: value, completed: false});
    this.render();
  },

  removeTask(){
  }
};

export default App;
