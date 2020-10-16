const currentDate = () => {
    var currentDate = new Date();
    var year = currentDate.getFullYear();
    var month = currentDate.getMonth();
    var day = currentDate.getDate();
    var dueDate = new Date(year,month, day + 10).toISOString().substr(0,10);
}
currentDate();