const express = require('express');
const path = require('path');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const ExpressError = require('./utils/expressError');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const userRoutes = require('./routes/Users');
const reviewsRoutes = require('./routes/Reviews');
const imagesRoutes = require('./routes/Images')

mongoose.connect('mongodb://localhost:27017/projectOne');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

//Ativação do express
const app = express();

//Ativação do ejs
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//Ativando o express-session
const sessionConfig = {
    secret: 'thisshouldbeabettersecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        HttpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
};

app.use(session(sessionConfig));
app.use(flash());


//Ativação do middleware do passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser()); //como armazenar na sessão
passport.deserializeUser(User.deserializeUser()); //como desarmazenar da sessão

//Middleware de ativação do flash em cada request
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

//Ligação do app.js com o ./routes/images.js
app.use('/', userRoutes);
app.use('/images', imagesRoutes);
app.use('/images/:id/review', reviewsRoutes);
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.render('medias/home');
});

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found!', 404));
});

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh no, Something went wrong...'
    res.status(statusCode).render('error', { err });
});

app.listen(3000, () => {
    console.log('serving!');
});

