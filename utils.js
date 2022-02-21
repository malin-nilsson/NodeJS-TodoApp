// Display status of todo (complete or not complete)
function displayStatus(todo) {
    if (todo.done === false) {
        return "No";
    } else {
        return "Yes";
    }
}

// Validate todo
function validateTodo(todo){
    let valid = true

    valid = valid && (todo.description)
    valid = valid && (todo.description.length > 0)
 
    return valid
}

module.exports = {
    displayStatus,
    validateTodo
}