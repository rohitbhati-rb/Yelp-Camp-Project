const express = require('express');
const path = require('path')
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const ExpressError = require('./utils/ExpressError');

const campgrounds = require('./routes/campgrounds');
const reviews = require('./routes/reviews');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify : false
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
const sessionConfig = {
    secret : 'thisshouldbeabettersecret',
    resave : false,
    saveUninitialized : true,
    cookie : {
        httpOnly : true,
        expires : Date.now() + 1000*60*60*24*7,
        maxAge : 1000*60*60*24*7
    }
}
app.use(session(sessionConfig));

// validateCampground middleware is in the campgrounds.js routes file

// validateReview middleware is in the reviews.js routes file

app.use('/campgrounds',campgrounds);
app.use('/campgrounds/:id/reviews',reviews);

app.get('/', (req, res) => {
    // res.send('Hello from Yelp Camp');
    res.render('home');
})
// '/campgrounds' routes are in the campgrounds.js router file

// '/reviews' routes are in the reviews.js router file

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
})

app.use((err, req, res, next) => {
    // const {statusCode = 500, message = 'Something Went Wrong'} = err;
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Something Went Wrong!😐';
    res.status(statusCode).render('error', { err });
    // res.send('Are bhai bhai bhai bhai!!');
})

app.listen(3000, () => {
    console.log('Serving from Port 3000');
});