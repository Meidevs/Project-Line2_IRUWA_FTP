var express = require('express');
var router = express.Router();

// Interface Router, Interface Router Tells Sub Router's Endpoint Definitions.
// Each of Sub Router has Own Processing Area.
// For Example, AuthRouter Manage Authentication Of Platform.
var authRouter = require('./appServer/auth');
var cateRouter = require('./appServer/cate');
var itemRouter = require('./appServer/item');
var alarmRouter = require('./appServer/alarm');
var searchRouter = require('./appServer/search');
var scheduleRouter = require('./appServer/schedule');

router.use('/auth', authRouter);
router.use('/category', cateRouter);
router.use('/item', itemRouter);
router.use('/alarm', alarmRouter);
router.use('/search', searchRouter);

module.exports = router;
