const express = require('express');
const exphbs = require('express-handlebars');
const connDB = require('./config/db');
const morgan = require('morgan');
const passportSetup = require('./config/passport');
const mongoose = require('mongoose');
const keys = require('./config/keys');
const cookieSession = require('cookie-session');
const passport = require('passport');


const app = express();
const PORT = 5000;



// setting up view engine 
app.set('view engine', 'ejs');

// connDB();

mongoose.connect(keys.mongodb.dbURI, {
    useNewUrlParser: true,
    useCreateIndex: true
}, () => {
    console.log("Mongodb connected");
});

//Init Middleware
app.use(express.json({ extended: false }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(cookieSession({
    maxAge: 60 * 60 * 1000,
    keys: [keys.session.cookieKey]
}));

//initialize passport 
app.use(passport.initialize());
app.use(passport.session());


app.get('/', (req, res) => res.render('home', { user: req.user }));
app.get('/login', (req, res) => res.render('login', { user: req.user }));
app.get('/profile', (req, res) => res.render('profile', { user: req.user }));

//Define routes 
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));


async function init() {
    app.listen(PORT, () => {
        console.log(`Server Started on port ${PORT}`);
    });
}
init();