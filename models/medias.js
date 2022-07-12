const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;

const MovieSchema = new Schema({
    title: String,
    release: Date,
    genre: String,
    director: String,
    runtime: Number,
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
MovieSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
});

module.exports = mongoose.model('Movie', MovieSchema);