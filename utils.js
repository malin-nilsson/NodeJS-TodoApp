// Display status of todo (complete or not complete)
module.exports.displayStatus = (todo) => {
    if (todo.done === false) {
        return "No";
    } else {
        return "Yes";
    }
}
