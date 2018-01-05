import Builder from './builder.js';

// TO DO APP
const App = {

  // source of truth - related to DOM tasks via text property
  data: [],
  filterState: null,

  init() {
    this.cacheDom();
    this.render();
    this.bindStatelessEvents();
  },

  cacheDom() {
    this.$taskInput = document.querySelector('input.task-input');
    this.$taskContainer = document.querySelector('div.task-container');
    this.$checkAll = document.querySelector('.check-all');
    this.$menu = document.querySelector('.menu');
    this.$count = document.querySelector('.count');
    this.$filters = Array.from(document.querySelector('.filters').children) || [];
    this.$filterAll = document.querySelector('#filter-all');
    this.$filterActive = document.querySelector('#filter-active');
    this.$filterCompleted = document.querySelector('#filter-completed');
    this.$clear = document.querySelector('.clear');
    this.$allTasks = Array.from(document.querySelectorAll('.task')) || [];
  },

  bindStatelessEvents() {
    this.$taskInput.addEventListener("keypress", ()=>{
      if ((event.which == 13 || event.keyCode == 13) && this.$taskInput.value !== ""){
        this.addTask(this.$taskInput.value);
        this.$taskInput.value = "";
      }
    });

    this.$checkAll.addEventListener("click", ()=> {
      // mark all as completed if task statuses are mixed
      let toggle = true;
      // if all tasks have identical status, just swap them
      if (identicalStatus(this.data).identical) {
        toggle = !identicalStatus(this.data).value;
      }
      this.$allTasks.forEach((div)=>{
        this.toggleCompleted(div.children[1].innerText, toggle);
      });
    });

    this.$clear.addEventListener("click", ()=> {
      let taskRemovals = [];
      this.data.forEach((el)=>{
        if (el.completed===true) {
          taskRemovals.push(el.text);
        }
      });
      this.removeTasks(taskRemovals);
    });

    this.$filterAll.addEventListener("click", ()=> {
      this.$filters.forEach(el=>el.className="");
      this.$filterAll.className = "selected";
      this.filterTasks("all");
    });

    this.$filterActive.addEventListener("click", ()=> {
      this.$filters.forEach(el=>el.className="");
      this.$filterActive.className = "selected";
      this.filterTasks("active");
    });

    this.$filterCompleted.addEventListener("click", ()=> {
      this.$filters.forEach(el=>el.className="");
      this.$filterCompleted.className = "selected";
      this.filterTasks("completed");
    });


  },

  bindStatefulEvents() {
    this.$allTasks.forEach((div)=>{
      // div.lastChild === 'X' button
      div.addEventListener("mouseover", ()=>{
        div.lastChild.className = "remove"; // removes invisible class
      });

      div.addEventListener("mouseleave", ()=>{
        div.lastChild.className = "remove invisible"; // adds invisible class
      });

      div.lastChild.addEventListener("click", ()=>{
        // to do: remove event listeners to prevent memory leaks, must use named event handler function

        // relate the DOM div to the data array and remove both
        this.removeTasks(div.children[1].innerText.split());
      });

      div.firstChild.addEventListener("click", ()=>{
        this.toggleCompleted(div.children[1].innerText);
      })
    });
  },

  addTask(value) {
    this.data.push({text: value, completed: false});
    this.render();
  },

  filterTasks(filterState) {
    this.filterState = filterState;
    this.render();
  },

  removeTasks(taskTextArray){
    taskTextArray.forEach((taskText)=>{
      this.data = this.data.filter((el)=>{
        return el.text !== taskText;
      });
    })
    this.render();
  },

  // optional value param sets the value
  toggleCompleted(taskText, value=null) {
    this.data.forEach((el)=>{
      if (el.text === taskText) {
        el.completed = value || !el.completed;
      }
    })
    this.render();
  },

  getTaskCount(){
    let result = this.data.filter((el)=>{
      return el.completed === false;
    });
    return result.length;
  },

  render() {
    // wipe the DOM to prepare new render
    this.$taskContainer.innerHTML = "";

    if (this.data.length > 0){

      /****** TASKS RENDER *******/

      // overwrite the allTasks DOM node array and append each task to the DOM
      this.$allTasks = Builder.buildTasks(this.data, this.filterState);
      this.$allTasks.forEach((div)=>{this.$taskContainer.append(div)});

      // bind events to each new task
      this.bindStatefulEvents();

      /****** INPUT RENDER *******/
      // remove invisible class
      this.$checkAll.className = "check-all";

      /****** MENU RENDER *******/

      // update active task count
      this.$count.innerHTML = `${this.getTaskCount()} Tasks Left`;

      // show the clear button
      this.data.length > this.getTaskCount()
        ? this.$clear.className = "clear"
        : this.$clear.className = "clear invisible";

      // show the menu
      this.$menu.className = "menu flex row";

    } else {
      this.$checkAll.className = "check-all invisible"
      this.$menu.className = "menu flex row hidden";
    }

    this.$taskInput.focus();
    this.$taskInput.select();
  }
};

function identicalStatus(data) {
    for(var i = 0; i < data.length - 1; i++) {
        if(data[i].completed !== data[i+1].completed) {
            return {identical: false, value: null};
        }
    }
    return {identical: true, value: data[0].completed};
}

export default App;
