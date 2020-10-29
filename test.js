const test = () => {
    var now = new Date();
    var a = now.toISOString().substring(0,10);
    console.log(a);
    var b = now.getHours();
    var b = now.getMinutes();
    console.log(b)
}
test();