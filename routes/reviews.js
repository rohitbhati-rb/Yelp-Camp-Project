const express = require('express');
const catchAsync = require('../utils/catchAsync');
const router = express.Router({mergeParams : true});
const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/campground');
const Review = require('../models/review');
const {reviewSchema} = require('../schemas');

const validateReview = (req,res,next) => {
    const {error} = reviewSchema.validate(req.body);
    if(error){
        // console.log(error);
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg,400);
    }
    else{
        next();
    }
}

router.post('/', validateReview , catchAsync(async(req,res) => {
    const campground = await Campground.findById(req.params.id);
    // console.log(req.body);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success','Created a new Review');
    res.redirect(`/campgrounds/${campground._id}`);
}))
router.delete('/:reviewId',catchAsync(async(req,res) => {
    const {id,reviewId} = req.params;
    await Campground.findByIdAndUpdate(id, {$pull : {reviews : reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash('success','Review deleted!');
    res.redirect(`/campgrounds/${id}`);
}))
module.exports = router;