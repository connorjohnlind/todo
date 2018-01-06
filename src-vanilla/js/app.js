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
        this.setTaskState(div.querySelector('.task-span').innerText, toggle);
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
      let checkbox = div.querySelector('.task-checkbox'),
          span = div.querySelector('.task-span'),
          input = div.querySelector('.task-edit'),
          button = div.querySelector('.task-remove');


      div.addEventListener("mouseover", ()=>{
        button.className = "task-remove"; // removes invisible class
      });

      div.addEventListener("mouseleave", ()=>{
        button.className = "task-remove invisible"; // adds invisible class
      });

      checkbox.addEventListener("click", ()=>{
        this.setTaskState(span.innerText);
      });

      span.addEventListener("dblclick", ()=> {
        span.className = "task-span hidden";
        input.value = span.innerHTML;
        input.className = "task-edit";
        input.focus();
      });

      input.addEventListener("keypress", ()=>{
        if ((event.which == 13 || event.keyCode == 13) && input.value !== ""){
          this.setTaskText(span.innerHTML, input.value);
          span.innerHTML = input.value;
          input.className = "task-edit hidden";
          
          this.getStatus(span.innerHTML)
            ? span.className = "task-span completed"
            : span.className = "task-span";
        }
      });

      input.addEventListener("focusout", ()=>{
        if (input.value !== ""){
          this.setTaskText(span.innerHTML, input.value);
          span.innerHTML = input.value;
          input.className = "task-edit hidden";
          this.getStatus(span.innerHTML)
            ? span.className = "task-span completed"
            : span.className = "task-span";
        }
      });

      button.addEventListener("click", ()=>{
        // relate the DOM div to the data array and remove both
        this.removeTasks(span.innerText.split());
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

  getStatus(taskText) {
    let result;
    this.data.forEach(el=>{
      if (el.text === taskText)
        result = el.status;
      return;
    });
    return result;
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
