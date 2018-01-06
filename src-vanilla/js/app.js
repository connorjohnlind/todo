import Datastore from './datastore.js'
import Builder from './builder.js';
import Helper from './helper.js';

const App = {

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
      // if all tasks have identical status, toggle the status
      if (Datastore.getIdenticalStatus().isIdentical) {
        toggle = !Datastore.getIdenticalStatus().value;
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

    this.$filterAll.addEventListener("click", ()=>{
      this.$filters.forEach(el=>Helper.removeClass(el, "selected"));
      Helper.addClass(this.$filterAll, "selected");
      Datastore.setFilter("all");
      this.render();
    });

    this.$filterActive.addEventListener("click", ()=>{
      this.$filters.forEach(el=>Helper.removeClass(el, "selected"));
      Helper.addClass(this.$filterActive, "selected");
      Datastore.setFilter("active");
      this.render();
    });

    this.$filterCompleted.addEventListener("click", ()=>{
      this.$filters.forEach(el=>Helper.removeClass(el, "selected"));
      Helper.addClass(this.$filterCompleted, "selected");
      Datastore.setFilter("completed");
      this.render();
    });
  },

  bindStatefulEvents() {

    /****** TASK EVENTS *******/
    // to do: remove event listeners to prevent memory leaks, must use named event handler function

    this.$allTasks.forEach(div=>{
      let checkbox = div.querySelector('.task-checkbox'),
          span = div.querySelector('.task-span'),
          input = div.querySelector('.task-edit'),
          button = div.querySelector('.task-remove');

      div.addEventListener("mouseover", ()=>{
        Helper.removeClass(button, "invisible");
      });

      div.addEventListener("mouseleave", ()=>{
        Helper.addClass(button, "invisible");
      });

      checkbox.addEventListener("click", ()=>{
        Datastore.setTaskStatus(span.innerText);
        Datastore.getStatus(span.innerHTML)
          ? Helper.addClass(span, "completed")
          : Helper.removeClass(span, "completed");
        this.render();
      });

      span.addEventListener("dblclick", ()=> {
        Helper.addClass(span, "hidden");
        input.value = span.innerHTML;
        Helper.removeClass(input, "hidden");
        input.focus();
      });

      input.addEventListener("keypress", ()=>{
        if ((event.which == 13 || event.keyCode == 13) && input.value !== ""){
          Datastore.setTaskText(span.innerHTML, input.value);
          span.innerHTML = input.value;
          Helper.addClass(input, "hidden");

          Datastore.getStatus(span.innerHTML)
            ? Helper.addClass(span, "completed")
            : Helper.removeClass(span, "completed");

          Helper.removeClass(span, "hidden");
        }
      });

      input.addEventListener("focusout", ()=>{
        if (input.value !== ""){
          Datastore.setTaskText(span.innerHTML, input.value);
          span.innerHTML = input.value;
          Helper.addClass(input, "hidden");

          Datastore.getStatus(span.innerHTML)
            ? Helper.addClass(span, "completed")
            : Helper.removeClass(span, "completed");

          Helper.removeClass(span, "hidden");
        }
      });

      button.addEventListener("click", ()=>{
        // relate the DOM div to the data array and remove both
        Datastore.removeTasks(span.innerText.split());
        this.render();
      });
    });
  },

  render() {
    // wipe the DOM to prepare new render
    this.$taskContainer.innerHTML = "";

    if (Datastore.getAll().length > 0){

      // remove the check all button's invisible class
      Helper.removeClass(this.$checkAll, "invisible");

      // overwrite the current allTasks DOM node array with new data
      this.$allTasks = Builder.buildTasks(Datastore.getAll(), Datastore.getFilter());

      // append all tasks the taskContainer
      this.$allTasks.forEach(div=>{this.$taskContainer.append(div)});

      // show task container
      Helper.removeClass(this.$taskContainer, "hidden");

      // bind events to each new task
      this.bindStatefulEvents();

      // update active task count
      this.$count.innerHTML = `${Datastore.getActiveTaskCount()} Tasks Left`;

      // show the clear button if there are completed tasks
      Datastore.getAll().length > Datastore.getActiveTaskCount()
        ? Helper.removeClass(this.$clear, "invisible")
        : Helper.addClass(this.$clear, "invisible");

      // show the menu
      Helper.removeClass(this.$menu, "hidden");

    } else {
      Helper.addClass(this.$checkAll, "invisible");
      Helper.addClass(this.$taskContainer, "hidden");
      Helper.addClass(this.$menu, "hidden");
    }

    this.$taskInput.focus();
    this.$taskInput.select();
  }
};

export default App;
