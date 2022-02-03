const express = require('express');
const exphbs = require('express-handlebars');
const {
    redirect
} = require('express/lib/response');
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

// Listening to port 8000
app.listen(8000, () => {
    console.log('http://localhost:8000/');
})
