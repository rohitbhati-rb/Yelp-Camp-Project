const express = require('express');
const catchAsync = require('../utils/catchAsync');
const router = express.Router();
const Campground = require('../models/campground');
const campgrounds = require('../controllers/campgrounds');
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');
const multer  = require('multer')
const {storage} = require('../cloudinary'); // node automatically looks up for a index.js file in a folder.
const upload = multer({storage});

// middleware functions were moved to middleware.js file

router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn, upload.array('image'), validateCampground, catchAsync(campgrounds.createCampground))
    // .post(upload.array('image'), (req,res) => {
    //     console.log(req.body, req.files);
    //     res.send(`it worked!`);
    // })

router.get('/new', isLoggedIn, campgrounds.renderNewForm)

router.route('/:id')
    .get(catchAsync(campgrounds.showCampground))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateCampground, catchAsync(campgrounds.updateCampground))
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm))

module.exports = router;