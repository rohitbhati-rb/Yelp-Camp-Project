const express = require('express');
const catchAsync = require('../utils/catchAsync');
const router = express.Router();
const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/campground');
const { campgroundSchema } = require('../schemas');
const { isLoggedIn } = require('../middleware');

const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    }
    else {
        next();
    }
    // console.log(result);
}

router.get('/', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}))
router.get('/new', isLoggedIn, (req, res) => {
    res.render('campgrounds/new');
})
router.post('/', isLoggedIn, validateCampground, catchAsync(async (req, res, next) => {
    // console.log(req.body);
    // if (!req.body.campground) throw new ExpressError('Invalid Campground Data', 400);
    const campground = new Campground(req.body.campground);
    await campground.save();
    req.flash('success', `Successfully made a new Campgorund`);
    res.redirect(`/campgrounds/${campground._id}`);
}))
router.get('/:id', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate('reviews');
    // console.log(campground);
    if (!campground) {
        req.flash('error', 'Cannot find that Campground!');
        res.redirect('/campgrounds');
    }
    else res.render('campgrounds/show', { campground });
}))
router.get('/:id/edit', isLoggedIn, catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
        req.flash('error', 'Cannot find that Campground!');
        res.redirect('/campgrounds');
    }
    else res.render('campgrounds/edit', { campground });
}))
router.put('/:id', isLoggedIn, validateCampground, catchAsync(async (req, res) => {
    // res.send('It Worked!!!');
    if (!req.body.campground) throw new ExpressError('Invalid Campground Data', 400);
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    req.flash('success', 'Successfully updated the campground!');
    res.redirect(`/campgrounds/${campground._id}`);
}))
router.delete('/:id', isLoggedIn, catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted the campground!');
    res.redirect('/campgrounds');
}))
module.exports = router;