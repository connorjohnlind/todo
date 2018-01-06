const Datastore = {
  data: [],

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

  getStatus(taskText) {
    let result;
    this.data.forEach(el=>{
      if (el.text === taskText)
        result = el.status;
      return;
    });
    return result;
  },

  getAll() {
    return this.data;
  }
}

export default Datastore;
