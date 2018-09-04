var mongoose = require('mongoose');
const Schema = mongoose.Schema

//create schema
var lessonSchema = Schema({
    //_id: mongoose.Schema.Types.ObjectId,
    subject: {
        type: String,
        required: true
    },
    semester: {
        type: Number,
        required: true
    },
    lessonId: {
        type: Number,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    videoTitle: {
        type: String
    },
    videoLink: String,
    showVideoLink: Boolean,
    careerTitle: {
        type: String
    },
    careerLink: String,
    movieTitle: {
        type: String,
        required: false
    },
    movieLink: String,
    showMovieLink: Boolean,
    documentLink: String,
    image: String
})

var Lesson = mongoose.model('Lesson', lessonSchema);

module.exports = Lesson;
