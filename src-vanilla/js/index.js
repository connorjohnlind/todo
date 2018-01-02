const taskInput = document.querySelector('input.task');

taskInput.addEventListener("click", function() {
  console.log('this is ' + this);
  this.focus();
  this.setSelectionRange(0, this.value.length);
});

taskInput.addEventListener("keypress", function() {
  if (event.which === 13) {
    console.log('yo');
  }
});
