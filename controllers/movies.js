const Movie = require('../models/medias');

module.exports.index = async (req, res) => {
    const movies = await Movie.find({});
    res.render('medias/index', { movies });
};

module.exports.renderNewForm = (req, res) => {
    res.render('medias/new');
};

module.exports.createMovie = async (req, res) => {
    const movies = new Movie(req.body.movie);
    movies.author = req.user._id;
    await movies.save();
    req.flash('success', 'Successfully added a new movie!');
    res.redirect('/movies');
};

module.exports.showMovie = async (req, res) => {
    const movie = await Movie.findById(req.params.id)
        .populate({
            path: 'reviews',
            populate: { path: 'author' }
        }).populate('author');

    if (!movie) {
        req.flash('error', 'Cannot find that movie!');
        return res.redirect('/movies');
    };
    res.render('medias/show', { movie });
};

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const movie = await Movie.findById(id);
    if (!movie) {
        req.flash('error', 'Cannot find that movie!');
        return res.redirect('/movies');
    };
    res.render('medias/edit', { movie });
};

module.exports.updateMovie = async (req, res) => {
    const { id } = req.params;
    const movie = await Movie.findByIdAndUpdate(id, { ...req.body.movie });
    req.flash('success', 'Successfully updated movie!');
    res.redirect(`/movies/${movie._id}`);
};

module.exports.deleteMovie = async (req, res) => {
    const { id } = req.params;
    await Movie.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted movie!');
    res.redirect('/movies');
};

