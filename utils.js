const db = require('./database.js')

/* Functions */

// Display status of todo (complete or not complete)
module.exports.displayStatus = (todo) => {
    if (todo.done === false) {
        return "No";
    } else {
        return "Yes";
    }
}

// Sort todos by date (oldest)
// https://stackoverflow.com/a/10124184
module.exports.sortByOldest = async () => {
    const collection = await db.getTodosCollection()
    const todos = await collection.find().toArray()

    await todos.sort(function (a, b) {
        let dateA = new Date(a.created),
            dateB = new Date(b.created);
        return dateA - dateB;
    });
}

// Sort todos by date (newest)
// https://stackoverflow.com/a/10124184
module.exports.sortByNewest = async () => {
    const collection = await db.getTodosCollection()
    const todos = await collection.find().toArray()

    await todos.sort(function (a, b) {
        let dateA = new Date(a.created),
            dateB = new Date(b.created);
        return dateB - dateA;
    });
}
