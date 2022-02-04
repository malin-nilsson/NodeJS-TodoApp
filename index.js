const express = require('express');
const exphbs = require('express-handlebars');
const {
    getNewID,
    sortByNewest,
    sortByOldest,
    displayStatus
} = require('./utils.js')
const app = express();
const todos = require('./data/todos.js')

app.engine('hbs', exphbs.engine({
    defaultLayout: 'main',
    extname: '.hbs'
}))

app.set('view engine', 'hbs');

app.use(express.static('public'));
app.use(express.urlencoded({
    extended: true
}));


// Route for home
app.get('/', (req, res) => {
    const sort = sortByOldest();

    res.render('home', {
        todos,
        sort,
    });
})

// Route for completed todos
app.get('/completed', (req, res) => {

    res.render('completed', {
        todos
    })
})

// Route for incomplete todos
app.get('/notcompleted', (req, res) => {

    res.render('notcompleted', {
        todos
    })
})

// Route for sorting by newest
app.get('/sortbynewest', (req, res) => {
    const sort = sortByNewest();

    res.render('sortbynewest', {
        todos,
        sort
    })
})

// Route for sorting by oldest
app.get('/sortbyoldest', (req, res) => {
    const sort = sortByOldest();

    res.render('sortbyoldest', {
        todos,
        sort
    })
})

// Route for creating new todo
app.get('/create', (req, res) => {
    res.render('create')
})

// Route for posting new todo
app.post('/create', (req, res) => {
    const id = getNewID(todos);

    const newTodo = {
        id: id,
        description: req.body.description,
        created: new Date().toLocaleString(),
        done: false,
    }
    todos.push(newTodo);

    res.redirect('/' + id);
})

// Route for showing individual todo
app.get('/:id', (req, res) => {
    let id = parseInt(req.params.id);
    let todo = todos.find(t => (t.id === id));
    let getStatus = displayStatus(todo);

    res.render('single', {
        todo,
        getStatus
    })

})

// Route for updating individual todo
app.get('/:id/update', (req, res) => {
    const id = parseInt(req.params.id);
    const todo = todos.find(t => t.id === id);

    res.render('update', {
        todo,
    })
})

// Route for posting updated todo
app.post('/:id/update', (req, res) => {
    const id = parseInt(req.params.id);
    const index = todos.findIndex(i => (i.id === id));

    req.body.status = Boolean(req.body.status);

    todos[index].description = req.body.description;
    todos[index].done = req.body.status;

    res.redirect('/' + id)
})

// Route for deleting individual todo
app.get('/:id/delete', (req, res) => {
    const id = parseInt(req.params.id);
    const todo = todos.find(t => t.id === id);

    res.render('delete', {
        todo
    })
})

// Route for confirming delete of todo
app.post('/:id/delete', (req, res) => {
    const id = parseInt(req.params.id);
    const index = todos.findIndex(i => i.id === id);

    todos.splice(index, 1);
    res.redirect('/')
})



// Listening to port 8000
app.listen(8000, () => {
    console.log('http://localhost:8000/');
})