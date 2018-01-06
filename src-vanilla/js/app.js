import Builder from './taskBuilder.js';
import Helper from './helper.js';

const App = {

  data: [],  // source of truth - related to tasks in DOM via text property

  menuFilter: null,  // mirrors the DOM's menu

  init() {
    this.cacheDom();
    this.render();
    this.bindStatelessEvents();
  },

  cacheDom() {
    this.$taskInput = document.querySelector('input.task-input');
    this.$checkAll = document.querySelector('.check-all');
    this.$taskContainer = document.querySelector('div.task-container');
    this.$allTasks = Array.from(document.querySelectorAll('.task')) || [];
    this.$menu = document.querySelector('.menu');
    this.$count = document.querySelector('.count');
    this.$filters = Array.from(document.querySelector('.filters').children) || [];
    this.$filterAll = document.querySelector('#filter-all');
    this.$filterActive = document.querySelector('#filter-active');
    this.$filterCompleted = document.querySelector('#filter-completed');
    this.$clear = document.querySelector('.clear');
  },

  bindStatelessEvents() {

    /****** TOP INPUT BAR EVENTS *******/

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
        this.setTaskState(div.children[1].innerText, toggle);
      });
    });

    /****** BOTTOM MENU BAR EVENTS *******/

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

    /****** TASK EVENTS *******/
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

      div.firstChild.addEventListener("click", ()=>{
        this.setTaskState(div.children[1].innerText);
      });

      div.children[1].addEventListener("dblclick", ()=> {
        div.children[1].className = "hidden";
        div.children[2].value = div.children[1].innerHTML;
        div.children[2].className = "task-edit";
        div.children[2].focus();
      });

      div.children[2].addEventListener("keypress", ()=>{
        if ((event.which == 13 || event.keyCode == 13) && div.children[2].value !== ""){
          this.setTaskText(div.children[1].innerHTML, div.children[2].value);
          div.children[1].innerHTML = div.children[2].value;
          div.children[2].className = "task-edit hidden";
          div.children[1].className = "";
        }
      });

      div.children[2].addEventListener("focusout", ()=>{
        if (div.children[2].value !== ""){
          this.setTaskText(div.children[1].innerHTML, div.children[2].value);
          div.children[1].innerHTML = div.children[2].value;
          div.children[2].className = "task-edit hidden";
          div.children[1].className = "";
        }
      });

      div.lastChild.addEventListener("click", ()=>{
        // relate the DOM div to the data array and remove both
        this.removeTasks(div.children[1].innerText.split());
      });
    });
  },

  addTask(value) {
    this.data.push({text: value, status: false});
    this.render();
  },

  filterTasks(menuFilter) {
    this.menuFilter = menuFilter;
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

  setTaskText(currentText, newText) {
    this.data.forEach(el=>{
      if (el.text === currentText)
        el.text = newText;
    })
  },

  // optional value param sets the value
  setTaskState(taskText, value=null) {
    this.data.forEach(el=>{
      if (el.text === taskText) {
        el.status = value || !el.status;
      }
    })
    this.render();
  },

  getCompletedTasks(){
    let taskRemovals = [];
    this.data.forEach((el)=>{
      if (el.status===true) {
        taskRemovals.push(el.text);
      }
    });
    return taskRemovals;
  },

  getActiveTaskCount(){
    let result = this.data.filter((el)=>{
      return el.status === false;
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
      this.$allTasks = Builder.buildTasks(this.data, this.menuFilter);

      // append all tasks the taskContainer
      this.$allTasks.forEach((div)=>{this.$taskContainer.append(div)});

      // show task container
      this.$taskContainer.className = "task-container flex";

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
      this.$checkAll.className = "check-all invisible";
      this.$taskContainer.className = "task-container flex hidden";
      this.$menu.className = "menu flex row hidden";
    }

    this.$taskInput.focus();
    this.$taskInput.select();
  }
};

export default App;
