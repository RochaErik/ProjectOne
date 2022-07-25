const Image = require('../models/medias');
const Review = require('../models/review');

module.exports.createReview = async (req, res) => {
    const image = await Image.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    image.reviews.push(review);
    await review.save();
    await image.save();
    req.flash('success', 'Created a new review!');
    res.redirect(`/images/${image._id}`);
};

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Image.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review!');
    res.redirect(`/images/${id}`);
};