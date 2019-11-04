const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const session = require('express-session');
const fs = require('fs');
const setupOptions = require('./middleware/setup-options');

const indexRouter = require('./routes/index');
const accountRouter = require('./routes/account');
const adRouter = require('./routes/ad');

const app = express();

require('dotenv').config();

const logging = process.env.ENABLE_LOGS === "true";

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'blade');

app.use(session({
    secret: 'work hard',
    resave: true,
    saveUninitialized: false
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

if (logging) {
    // create a write stream (in append mode)
    const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });
    // setup the logger
    app.use(morgan('combined', { stream: accessLogStream }));
} else {
    app.use(morgan('dev'));
}

app.use('/', indexRouter);
app.use('/account', accountRouter);
app.use('/ads', adRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error', setupOptions(req));
});

module.exports = app;
