import Datastore from './datastore.js'
import Builder from './builder.js';
import Helper from './helper.js';

const App = {

  menuFilter: null,  // source of truth for the DOM's menu

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
        Datastore.addTask(this.$taskInput.value);
        this.$taskInput.value = "";
        this.render();
      }
    });

    this.$checkAll.addEventListener("click", ()=>{
      // mark all tasks as completed if task statuses are mixed
      let toggle = true;
      let data = Datastore.getAll();
      // if all tasks have identical status, just swap them
      if (Helper.identicalStatus(data).identical) {
        toggle = !Helper.identicalStatus(data).value;
      }
      this.$allTasks.forEach(div=>{
        Datastore.setTaskStatus(div.querySelector('.task-span').innerText, toggle);
      });
      this.render();
    });

    /****** BOTTOM MENU BAR EVENTS *******/

    this.$clear.addEventListener("click", ()=>{
      Datastore.removeTasks(Datastore.getCompletedTasks());
      this.render();
    });


    // TO DO: Above this line, data is managed and renders happen.
    //        Below this line, it's pure DOM
    //        Need to think about consistency


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
        Datastore.setTaskStatus(span.innerText);
        Datastore.getStatus(span.innerHTML)
          ? span.className = "task-span completed"
          : span.className = "task-span";
      });

      span.addEventListener("dblclick", ()=> {
        span.className = "task-span hidden";
        input.value = span.innerHTML;
        input.className = "task-edit";
        input.focus();
      });

      input.addEventListener("keypress", ()=>{
        if ((event.which == 13 || event.keyCode == 13) && input.value !== ""){
          Datastore.setTaskText(span.innerHTML, input.value);
          span.innerHTML = input.value;
          input.className = "task-edit hidden";

          Datastore.getStatus(span.innerHTML)
            ? span.className = "task-span completed"
            : span.className = "task-span";
        }
      });

      input.addEventListener("focusout", ()=>{
        if (input.value !== ""){
          Datastore.setTaskText(span.innerHTML, input.value);
          span.innerHTML = input.value;
          input.className = "task-edit hidden";
          Datastore.getStatus(span.innerHTML)
            ? span.className = "task-span completed"
            : span.className = "task-span";
        }
      });

      button.addEventListener("click", ()=>{
        // relate the DOM div to the data array and remove both
        Datastore.removeTasks(span.innerText.split());
        this.render();
      });
    });
  },

  filterTasks(menuFilter) {
    this.menuFilter = menuFilter;
    this.render();
  },

  render() {
    // wipe the DOM to prepare new render
    this.$taskContainer.innerHTML = "";

    if (Datastore.getAll().length > 0){

      // remove the check all button's invisible class
      this.$checkAll.className = "check-all";

      // overwrite the current allTasks DOM node array with new data
      this.$allTasks = Builder.buildTasks(Datastore.getAll(), this.menuFilter);

      // append all tasks the taskContainer
      this.$allTasks.forEach((div)=>{this.$taskContainer.append(div)});

      // show task container
      this.$taskContainer.className = "task-container flex";

      // bind events to each new task
      this.bindStatefulEvents();

      // update active task count
      this.$count.innerHTML = `${Datastore.getActiveTaskCount()} Tasks Left`;

      // show the clear button if there are completed tasks
      Datastore.getAll().length > Datastore.getActiveTaskCount()
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
