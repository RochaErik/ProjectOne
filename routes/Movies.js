const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, validateMovie, isAuthor } = require('../middleware');
const movies = require('../controllers/movies');

router.route('/')
    .get(catchAsync(movies.index))
    .post(isLoggedIn, validateMovie, catchAsync(movies.createMovie));

router.get('/new', isLoggedIn, movies.renderNewForm);

router.route('/:id')
    .get(catchAsync(movies.showMovie))
    .put(isLoggedIn, isAuthor, validateMovie, catchAsync(movies.updateMovie))
    .delete(isLoggedIn, isAuthor, catchAsync(movies.deleteMovie));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(movies.renderEditForm));

module.exports = router;
