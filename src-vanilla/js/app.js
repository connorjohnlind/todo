import Builder from './taskBuilder.js';
import Helper from './helper.js';

const App = {

  data: [],  // source of truth - related to tasks in DOM via text property

  filterState: null,  // mirrors the DOM's menu

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

    /****** App Input Bar Events *******/

    this.$taskInput.addEventListener("keypress", ()=>{
      if ((event.which == 13 || event.keyCode == 13) && this.$taskInput.value !== ""){
        this.addTask(this.$taskInput.value);
        this.$taskInput.value = "";
      }
    });

    this.$checkAll.addEventListener("click", ()=>{
      // mark all tasks as completed if task statuses are mixed
      let toggle = true;
      // if all tasks have identical status, just swap them
      if (Helper.identicalStatus(this.data).identical) {
        toggle = !Helper.identicalStatus(this.data).value;
      }
      this.$allTasks.forEach(div=>{
        this.toggleTaskState(div.children[1].innerText, toggle);
      });
    });

    /****** App Menu Bar Events *******/

    this.$clear.addEventListener("click", ()=>{
      this.removeTasks(this.getCompletedTasks());
    });

    this.$filterAll.addEventListener("click", ()=>{
      this.$filters.forEach(el=>el.className="");
      this.$filterAll.className = "selected";
      this.filterTasks("all");
    });

    this.$filterActive.addEventListener("click", ()=>{
      this.$filters.forEach(el=>el.className="");
      this.$filterActive.className = "selected";
      this.filterTasks("active");
    });

    this.$filterCompleted.addEventListener("click", ()=>{
      this.$filters.forEach(el=>el.className="");
      this.$filterCompleted.className = "selected";
      this.filterTasks("completed");
    });
  },

  bindStatefulEvents() {

    /****** Task Events *******/
    // to do: remove event listeners to prevent memory leaks, must use named event handler function

    this.$allTasks.forEach((div)=>{
      // div.lastChild === 'X' button
      // div.children[1].innerText === task text

      div.addEventListener("mouseover", ()=>{
        div.lastChild.className = "remove"; // removes invisible class
      });

      div.addEventListener("mouseleave", ()=>{
        div.lastChild.className = "remove invisible"; // adds invisible class
      });

      div.lastChild.addEventListener("click", ()=>{
        // relate the DOM div to the data array and remove both
        this.removeTasks(div.children[1].innerText.split());
      });

      div.firstChild.addEventListener("click", ()=>{
        this.toggleTaskState(div.children[1].innerText);
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
  toggleTaskState(taskText, value=null) {
    this.data.forEach((el)=>{
      if (el.text === taskText) {
        el.completed = value || !el.completed;
      }
    })
    this.render();
  },

  getCompletedTasks(){
    let taskRemovals = [];
    this.data.forEach((el)=>{
      if (el.completed===true) {
        taskRemovals.push(el.text);
      }
    });
    return taskRemovals;
  },

  getActiveTaskCount(){
    let result = this.data.filter((el)=>{
      return el.completed === false;
    });
    return result.length;
  },

  render() {
    // wipe the DOM to prepare new render
    this.$taskContainer.innerHTML = "";

    if (this.data.length > 0){

      // remove the check all button's invisible class
      this.$checkAll.className = "check-all";

      // overwrite the current allTasks DOM node array with new data
      this.$allTasks = Builder.buildTasks(this.data, this.filterState);

      // append all tasks the taskContainer
      this.$allTasks.forEach((div)=>{this.$taskContainer.append(div)});

      // bind events to each new task
      this.bindStatefulEvents();

      // update active task count
      this.$count.innerHTML = `${this.getActiveTaskCount()} Tasks Left`;

      // show the clear button if there are completed tasks
      this.data.length > this.getActiveTaskCount()
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

export default App;
