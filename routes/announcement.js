const express = require('express');
const router = express.Router();
const Announcement = require('../model/announcement/announcement-schema');
const wrap = require('../middleware/promise-wrapper');
const setupOptions = require('../middleware/setup-options');

router.get('/', wrap(async function(req, res) {
    const announcements = await Announcement.find();
    console.log(announcements);
    res.render('announcement/list', setupOptions(req, { announcements }));
}));

router.get('/id=:id', wrap(async function(req, res) {
    console.log(req.params.id);
    const announcement = await Announcement.findById(req.params.id);
    res.render('announcement/read', setupOptions(req, { announcement }));
}));

router.get('/create', function(req, res) {
    res.render('announcement/create', setupOptions(req, { error: null }));
});

router.post('/create', wrap(async function(req, res) {
    const announcement = new Announcement(req.body);
    await announcement.save();
    res.redirect('/');
}));

module.exports = router;