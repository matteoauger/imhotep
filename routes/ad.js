const express = require('express');
const router = express.Router();
const Ad = require('../model/ad/ad-schema');
const wrap = require('../middleware/promise-wrapper');
const setupOptions = require('../middleware/setup-options');

router.get('/', wrap(async function(req, res) {
    const ads = await Ad.find();
    console.log(ads);
    res.render('ad/list', setupOptions(req, { ads }));
}));

router.get('/:id', wrap(async function(req, res) {
    const ad = await Ad.findById(req.params.id);
    res.render('ad/read', setupOptions(req, { ad, error: {} }));
}));

router.get('/create', function(req, res) {
    res.render('ad/create', setupOptions(req, { error: null }));
});

router.post('/create', wrap(async function(req, res) {
    const ad = new Ad(req.body);
    await ad.save();
    res.redirect('/');
}));

module.exports = router;