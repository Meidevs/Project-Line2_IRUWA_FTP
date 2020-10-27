var express = require('express');
var router = express.Router();

// Interface Router, Interface Router Tells Sub Router's Endpoint Definitions.
// Each of Sub Router has Own Processing Area.
// For Example, AuthRouter Manage Authentication Of Platform.
var authRouter = require('./adminServer/auth');
var itemRouter = require('./adminServer/item');
var cateRouter = require('./adminServer/category');
var serveRouter = require('./adminServer/service');

router.use('/auth', authRouter);
router.use('/', itemRouter);
router.use('/category', cateRouter);
router.use('/service', serveRouter);

module.exports = router;