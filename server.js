const express = require('express');
const exphbs = require('express-handlebars');
const connDB = require('./config/db');
const morgan = require('morgan');

const app = express();


connDB();

//Init Middleware
app.use(express.json({ extended: false }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));


app.get('/', (req, res) => res.send("App running"));

//Define routes 
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));

const PORT = 5000;

async function init() {
    app.listen(PORT, () => {
        console.log(`Server Started on port ${PORT}`);
    });
}
init();