const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const faqSchema = new Schema({
    question: {
        type: String,
        required: "Question is required!"
    },
    response: {
        type: String,
        required: "Answer is Required!"
    }
})

module.exports = mongoose.model("Faq", faqSchema);