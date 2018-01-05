const Helpers = {
  identicalStatus(data) {
    for (var i = 0; i < data.length - 1; i++) {
      if (data[i].completed !== data[i + 1].completed) {
        return {identical: false, value: null};
      }
    }
    return {identical: true, value: data[0].completed};
  }
}
 export default Helpers;
