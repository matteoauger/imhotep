const express = require('express');
const router = express.Router();
const Announcement = require('../model/announcement/announcement-schema');

router.get('/', async function(req, res) {
    const announcements = await Announcement.find();
    console.log(announcements);
    res.render('announcement/announcements', { announcements });
});

router.get('/create', function(req, res) {
    res.render('announcement/create');
});

router.post('/create', async function(req, res) {
    const announcement = new Announcement(req.body);
    await announcement.save();
    res.redirect('/');
});

module.exports = router;