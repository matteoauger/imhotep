const express = require('express');
const router = express.Router();
const renderView = require('../middleware/render-view');

/* GET home page. */
router.get('/', function (req, res) {
    renderView(req, res, 'index');
});

module.exports = router;
