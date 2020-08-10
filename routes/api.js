var express = require('express');
var router = express.Router();
var authRouter = require('./appServer/auth');
var cateRouter = require('./appServer/cate');

router.use('/auth', authRouter);
router.use('/category', cateRouter)

module.exports = router;
