const getTime = () => {
    var year = new Date().getFullYear();
    var month = new Date().getMonth();
    var day = new Date().getDate();
    var daysAgo = new Date(year, month, day - 2).toISOString().substring(0,10);
    console.log(daysAgo)
}

getTime();