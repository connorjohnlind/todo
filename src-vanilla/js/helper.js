const Helpers = {
  identicalStatus(data) {
    for (var i = 0; i < data.length - 1; i++) {
      if (data[i].status !== data[i + 1].status) {
        return {identical: false, value: null};
      }
    }
    return {identical: true, value: data[0].status};
  }
}
 export default Helpers;
