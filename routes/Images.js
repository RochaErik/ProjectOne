const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, validateImage, isAuthor } = require('../middleware');
const images = require('../controllers/images');
const { storage } = require('../cloudinary');
const multer = require('multer');
const upload = multer({ storage });

router.route('/')
    .get(catchAsync(images.index))
    .post(isLoggedIn, upload.array('image'), validateImage, catchAsync(images.createImage));

router.get('/new', isLoggedIn, images.renderNewForm);

router.route('/:id')
    .get(catchAsync(images.showImage))
    .put(isLoggedIn, isAuthor, validateImage, catchAsync(images.updateImage))
    .delete(isLoggedIn, isAuthor, catchAsync(images.deleteImage));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(images.renderEditForm));

module.exports = router;
