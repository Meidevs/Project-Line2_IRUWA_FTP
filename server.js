const body = require('body-parser');
const express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
var path = require('path');
var cookieParser = require('cookie-parser');
var static = require('serve-static');
var apiRouter = require('./routes/api');

const app1 = express();
const app2 = express();

// view engine setup
app1.use(bodyParser.json());
app1.set('views', path.join(__dirname, 'views'));
app1.set('view engine', 'ejs');
app1.use(logger('dev'));
app1.use(express.json());
app1.use(express.urlencoded({ extended: false }));
app1.use(cookieParser());
app1.use(express.static(path.join(__dirname, 'public')));

app2.use(bodyParser.json());
app2.set('views', path.join(__dirname, 'views'));
app2.set('view engine', 'ejs');
app2.use(logger('dev'));
app2.use(express.json());
app2.use(express.urlencoded({ extended: false }));
app2.use(cookieParser());
app2.use(express.static(path.join(__dirname, 'public')));

app1.use('/api', apiRouter);
app2.use('/api', apiRouter);

// Parse the request body as JSON
app1.use(body.json());
app2.use(body.json());

app1.listen(3000);
app2.listen(3001);