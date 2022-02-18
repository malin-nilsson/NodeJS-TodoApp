const express = require('express')
const db = require('../database.js')
const {
    ObjectId
} = require('mongodb')
const {
    sortByNewest,
    sortByOldest,
    displayStatus
} = require('../utils.js')

const router = express.Router()

router.get('/', async (req, res) => {
    const collection = await db.getTodosCollection()
    const todos = await collection.find().toArray()
    const sort = sortByOldest();


    res.render('home', {
        todos,
        sort
    })
})

router.get('/create', (req, res) => {
    res.render('todos/todos-create')
})

router.post('/create', async (req, res) => {
    const todo = {
        description: req.body.description,
        created: new Date().toLocaleString(),
        done: false,
    }

    const todosCollection = await db.getTodosCollection()
    const result = await todosCollection.insertOne(todo)

    res.redirect("/todos/" + result.insertedId)
})

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

router.post('/:id/delete', async (req, res, next) => {
    let id = undefined;
    try {
        id = ObjectId(req.params.id)
    } catch {
        next()
    }

    if (id) {
        const collection = await db.getTodosCollection()
        const result = await collection.deleteOne({
            _id: id
        })

        res.redirect("/todos")
    }
})

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

router.post('/:id/update', async (req, res, next) => {
    let id = ObjectId(req.params.id)
    req.body.status = Boolean(req.body.status);

    const todo = {
        description: req.body.description,
        done: req.body.status
    }

    const collection = await db.getTodosCollection()
    await collection.updateOne({
        _id: id
    }, {
        $set: todo
    })

    res.redirect("/todos/" + id)

})

router.get('/sortbynewest', (req, res) => {
    const sort = sortByNewest();

    res.render('todos/todos-sortbynewest', {
        todos,
        sort
    })
})

router.get('/sortbyoldest', (req, res) => {
    const sort = sortByOldest();

    res.render('todos/todos-sortbyoldest', {
        todos,
        sort
    })
})

module.exports = router