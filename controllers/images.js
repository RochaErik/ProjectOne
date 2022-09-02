const Image = require('../models/medias');

module.exports.index = async (req, res) => {
    const images = await Image.find({});
    res.render('medias/index', { images });
};

module.exports.renderNewForm = (req, res) => {
    res.render('medias/new');
};

module.exports.createImage = async (req, res) => {
    const image = new Image(req.body.image);
    image.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    image.author = req.user._id;
    await image.save();
    req.flash('success', 'Successfully added a new image!');
    res.redirect(`/images/${image._id}`);
};

module.exports.showImage = async (req, res) => {
    const image = await Image.findById(req.params.id)
        .populate({
            path: 'reviews',
            populate: { path: 'author' }
        }).populate('author');

    if (!image) {
        req.flash('error', 'Cannot find that image!');
        return res.redirect('/images');
    };
    res.render('medias/show', { image });
};

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const image = await Image.findById(id);
    if (!image) {
        req.flash('error', 'Cannot find that image!');
        return res.redirect('/images');
    };
    res.render('medias/edit', { image });
};

module.exports.updateImage = async (req, res) => {
    const { id } = req.params;
    const image = await Image.findByIdAndUpdate(id, { ...req.body.image });
    req.flash('success', 'Successfully updated image!');
    res.redirect(`/images/${image._id}`);
};

module.exports.deleteImage = async (req, res) => {
    const { id } = req.params;
    await Image.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted image!');
    res.redirect('/images');
};

