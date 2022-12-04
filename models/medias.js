const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;

const PictureSchema = new Schema({
    url: String,
    filename: String
});


PictureSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200,h_150');
});

const ImageSchema = new Schema({
    title: String,
    property: String,
    description: String,
    images: [PictureSchema],
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
});

//Comandos necessários para deletar os reviews associados a cada campground
ImageSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
});

module.exports = mongoose.model('Image', ImageSchema);