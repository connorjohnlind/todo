import Builder from './builder.js';

// TO DO APP
const App = {

  data: [],

  init() {
    this.cacheDom();
    this.render();
    this.bindEvents();
  },

  cacheDom() {
    this.$taskInput = document.querySelector('input.task-input');
    this.$taskContainer = document.querySelector('div.task-container');
    this.$checkAll = document.querySelector('.check-all');
    this.$allTasks = Array.from(document.querySelectorAll('.task')) || [];
  },

  bindEvents() {
    this.$taskInput.addEventListener("keypress", ()=>{
      if (event.which == 13 || event.keyCode == 13){
        this.addTask(this.$taskInput.value);
        this.$taskInput.value = "";
        this.$checkAll.className = "check-all";  // removes invisible class
      }
    });
  },

  addTask(value) {
    this.data.push({text: value, completed: false});
    this.render();
  },

  removeTask(text){
    this.data = this.data.filter(function(el) {
      return el.text !== text;
    });
    this.render();
  },

  render() {
    // wipe the DOM to prepare new render
    this.$taskContainer.innerHTML = "";

    if (this.data.length > 0){

      // overwrite the allTasks array
      // and append each task to the DOM
      this.$allTasks = Builder.buildTasks(this.data);
      this.$allTasks.forEach((div)=>{
        this.$taskContainer.append(div);
      });

      // bind events to each new task
      this.$allTasks.forEach((div)=>{
        div.addEventListener("mouseover", ()=>{
          div.lastChild.className = "remove"; // removes invisible class
        });
        div.addEventListener("mouseleave", ()=>{
          div.lastChild.className = "remove invisible"; // removes invisible class
        });
        div.lastChild.addEventListener("click", ()=>{
          // relate the DOM div to the DATA array and remove it
          this.removeTask(div.children[1].innerText);
        });
      });

      // update the filter footer
      let div = Builder.buildFilters(this.data);
      this.$taskContainer.append(div);

    };

  }
};

export default App;
