const express = require('express');
const router = express.Router();
const setupOptions = require('../middleware/setup-options');

/* GET home page. */
router.get('/', function (req, res) {
    res.render('index', setupOptions(req));
});

module.exports = router;
