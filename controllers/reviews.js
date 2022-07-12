const Movie = require('../models/medias');
const Review = require('../models/review');

module.exports.createReview = async (req, res) => {
    const movie = await Movie.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    movie.reviews.push(review);
    await review.save();
    await movie.save();
    req.flash('success', 'Created a new review!');
    res.redirect(`/movies/${movie._id}`);
};

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Movie.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review!');
    res.redirect(`/movies/${id}`);
};