const express = require('express');
const router = express.Router();
const Announcement = require('../model/announcement/announcement-schema');
const wrap = require('../middleware/promise-wrapper');
const renderView = require('../middleware/render-view');

router.get('/', wrap(async function(req, res) {
    const announcements = await Announcement.find();
    console.log(announcements);
    renderView(req, res, 'announcement/list', { announcements });
}));

router.get('/id=:id', wrap(async function(req, res) {
    console.log(req.params.id);
    const announcement = await Announcement.findById(req.params.id);
    renderView(req, res, 'announcement/read', { announcement });
}));

router.get('/create', function(req, res) {
    renderView(req, res, 'announcement/create', { error: null });
});

router.post('/create', wrap(async function(req, res) {
    const announcement = new Announcement(req.body);
    await announcement.save();
    res.redirect('/');
}));

module.exports = router;