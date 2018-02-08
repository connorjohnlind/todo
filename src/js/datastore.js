const Datastore = {
  data: [],
  filter: null,  // source of truth for the DOM's menu

  addTask(text) {
    this.data.push({text: text, status: false});
  },

  removeTasks(taskTextArray){
    taskTextArray.forEach((taskText)=>{
      this.data = this.data.filter((el)=>{
        return el.text !== taskText;
      });
    })
  },

  setTaskText(currentText, newText) {
    this.data.forEach(el=>{
      if (el.text === currentText)
        el.text = newText;
    })
  },

  // optional value param sets the value
  setTaskStatus(text, value=null) {
    this.data.forEach(el=>{
      if (el.text === text) {
        el.status = value || !el.status;
      }
    })
  },

  setFilter(filter) {
    this.filter = filter;
  },

  getActiveTaskCount(){
    let result = this.data.filter((el)=>{
      return el.status === false;
    });
    return result.length;
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

  getFilter() {
    return this.filter;
  },

  // returns an object with parameters "isIdentical" and its value if so
  getIdenticalStatus() {
    for (var i = 0; i < this.data.length - 1; i++) {
      if (this.data[i].status !== this.data[i + 1].status) {
        return {isIdentical: false, value: null};
      }
    }
    return {isIdentical: true, value: this.data[0].status};
  },

  getStatus(taskText) {
    let result;
    this.data.forEach(el=>{
      if (el.text === taskText)
        result = el.status;
    });
    return result;
  },

  getAll() {
    return this.data;
  }
}

export default Datastore;
