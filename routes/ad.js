const express = require('express');
const createError = require('http-errors');
const router = express.Router();
const { Ad, Type, PublishStatus, TransactionStatus } = require('../model/ad-schema');
const roleRestriction = require('../middleware/role-restriction');
const UserRoles = require('../model/user-roles');
const wrap = require('../middleware/promise-wrapper');
const setupOptions = require('../middleware/setup-options');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

router.get('/', wrap(async function(req, res) {
    const ads = await Ad.find({}, { pictures: 0 });
    res.render('ad/list', setupOptions(req, { ads }));
}));

router.get('/id=:id', wrap(async function(req, res) {
    const ad = await Ad.findById(req.params.id, { 'pictures.data': 0 });
    if (!ad) {
        throw createError(404); 
    }
    res.render('ad/read', setupOptions(req, { ad }));
}));

router.get('/id=:id/pictures/:index', wrap(async function(req, res) {
    const id = req.params.id;
    const ad = await Ad.findById(id, { pictures: 1 });
    if (!ad) {
        throw createError(404); 
    }
    const index = req.params.index;
    if (!ad.pictures || !ad.pictures[index]) {
        throw createError(404); 
    }
    res.send(ad.pictures[index].data);
}));

router.get('/create', roleRestriction(UserRoles.AGENT), function(req, res) {
    res.render('ad/create', setupOptions(req, {
        errors: {}, 
        data: {}, 
        types: Type, 
        publish_status: PublishStatus,
        transaction_status: TransactionStatus
    }));
});

router.post('/create', roleRestriction(UserRoles.AGENT), upload.array('pictures', 3), wrap(async function(req, res, next) {
    try {
        await insertAd(req);
        res.redirect('/ads');
    } catch (error) {
        if (error.name === 'ValidationError') {
            const options = setupOptions(req, { 
                errors: error.errors, 
                data: req.body, 
                types: Type, 
                publish_status: PublishStatus,
                transaction_status: TransactionStatus
            });
            res.render('/ads/create', options);
        } else {
            next(error);
        }
    }
}));

router.delete('/delete', roleRestriction(UserRoles.AGENT), wrap(async function(req, res) {
    const id = req.body.id;
    await Ad.deleteOne({ _id: id });
    res.sendStatus(200);
}));

function insertAd(req) {
    const ad = new Ad(req.body);
    ad.pictures = req.files.map(file => ({
        name: file.originalname,
        data: file.buffer
    }));
    return ad.save();
}

module.exports = router;