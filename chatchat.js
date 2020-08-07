const body = require('body-parser');
const express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
var path = require('path');
var cookieParser = require('cookie-parser');
var static = require('serve-static');

//Middle Ware List
var chatRouter = require('./routes/chat');

const app1 = express();

// view engine setup
app1.use(bodyParser.json());
app1.set('views', path.join(__dirname, 'views'));
app1.set('view engine', 'ejs');
app1.use(logger('dev'));
app1.use(express.json());
app1.use(express.urlencoded({ extended: false }));
app1.use(cookieParser());
app1.use(express.static(path.join(__dirname, 'public')));

// Request API, RESTful Endpoint
app1.use('/', chatRouter);

// Parse the request body as JSON
app1.use(body.json());

app1.listen(4000);