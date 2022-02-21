// REQUIRES //
const express = require('express')
const db = require('../database.js')
const {
    ObjectId
} = require('mongodb')
const {
    displayStatus,
    validateTodo
} = require('../utils.js')

// ROUTER
const router = express.Router()

router.get('/', async (req, res) => {
    const collection = await db.getTodosCollection()
    const todos = await collection.find().toArray()

    res.render('todos/todos-list', {
        todos
    })
})

// GET: Create todo
router.get('/create', (req, res) => {
    res.render('todos/todos-create')
})

// POST: Create todo
router.post('/create', async (req, res) => {
    const todo = {
        description: req.body.description,
        created: new Date().toLocaleString(),
        done: false,
    }

    if (validateTodo(todo)) {
        const todosCollection = await db.getTodosCollection()
        const result = await todosCollection.insertOne(todo)
    
        res.redirect("/todos/" + result.insertedId)
    } else {
        res.render("todos/todos-create", {
            error: "You forgot to add a description!",
            created: new Date().toLocaleString(),
            done: false
        })
    } 
})

// GET: Specific todo
router.get('/:id', async (req, res, next) => {
    let id = undefined;

    try {
        id = ObjectId(req.params.id)
    } catch {
        next()
    }

    if (id) {
        const collection = await db.getTodosCollection()

        collection.findOne({
            _id: id
        }, (err, todo) => {
            if (todo) {
                let getStatus = displayStatus(todo);
                res.render('todos/todos-single', {
                    todo,
                    getStatus
                })
            } else {
                next()
            }
        })
    }
})

// GET: Delete todo
router.get('/:id/delete', async (req, res, next) => {
    let id = ObjectId(req.params.id)

    if (id) {
        const collection = await db.getTodosCollection()

        collection.findOne({
            _id: id
        }, (err, todo) => {
            if (todo) {
                res.render('todos/todos-delete', todo)
            } else {
                next()
            }
        })
    }
    
})

// POST: Delete todo
router.post('/:id/delete', async (req, res, next) => {
    let id = ObjectId(req.params.id)
  
        const collection = await db.getTodosCollection()
        const result = await collection.deleteOne({
            _id: id
        })

        res.redirect("/todos")
    
})

// GET: Update id
router.get('/:id/update', async (req, res, next) => {
    let id = ObjectId(req.params.id)

    if (id) {
        const collection = await db.getTodosCollection()

        collection.findOne({
            _id: id
        }, (err, todo) => {
            if (todo) {
                res.render('todos/todos-update', todo)
            } else {
                next()
            }
        })
    }
})

// POST: Update todo
router.post('/:id/update', async (req, res, next) => {
    let id = ObjectId(req.params.id)
    req.body.status = Boolean(req.body.status);

    const todo = {
        description: req.body.description,
        done: req.body.status
    }

    if (validateTodo(todo)) {
        const collection = await db.getTodosCollection()
        await collection.updateOne({
            _id: id
        }, {
            $set: todo
        })
    
        res.redirect("/todos/" + id)
    } else {
        res.render("todos/todos-update", {
            error: "You forgot to add a description!",
            _id: id,
            title: todo.description,
        })
    }
})

// GET: Sort by newest
router.get('/sortbynewest', async (req, res) => {
    const collection = await db.getTodosCollection()
    const todos = await collection.find().toArray()
    const sort = todos.sort(function (a, b) {
        let dateA = new Date(a.created),
            dateB = new Date(b.created);
        return dateB - dateA;
    });

    res.render('todos/todos-sortbynewest', {
        todos,
        sort
    })
})

// GET: Sort by oldest
router.get('/sortbyoldest', async (req, res) => {
    const collection = await db.getTodosCollection()
    const todos = await collection.find().toArray()
 
    todos.sort(function (a, b) {
        let dateA = new Date(a.created), dateB = new Date(b.created)
        return dateA - dateB
    },

        res.render('todos/todos-sortbyoldest', {
            todos
        }))
})

// GET: Completed todos
router.get('/completed', async (req, res) => {
    const collection = await db.getTodosCollection()
    const todos = await collection.find().toArray()

    res.render('todos/todos-completed', {
        todos
    })
})

// GET: Uncompleted todos
router.get('/not-completed', async (req, res) => {
    const collection = await db.getTodosCollection()
    const todos = await collection.find().toArray()

    res.render('todos/todos-notcompleted', {
        todos
    })
})

module.exports = router