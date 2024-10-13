const mongoose = require('mongoose')

const ratingSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    grade: { type: Number, min: 1, max: 5, required: true }
}, { _id: false });

const bookSchema = mongoose.Schema({
    userId: { type: String, required: true },   
    title: { type: String, required: true },
    author: { type: String, required: true },
    imageUrl: { type: String, required: true },
    year: { type: Number, required: true },
    genre: { type: String, required: true },
    ratings: [ratingSchema], 
    averageRating : { type: Number, default: 0, required: true}
})

module.exports = mongoose.model('Book', bookSchema)