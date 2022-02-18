require('dotenv').config();
const express = require('express');
const exphbs = require('express-handlebars');
const todosRouter = require('./routers/todos-router.js')
const app = express();

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
    res.render('home')
})

app.use('/todos', todosRouter)


app.use('/', (req, res) => {
    res.status(404).render("not-found")
})

app.listen(8000, () => {
    console.log("http://localhost:8000/");
})

