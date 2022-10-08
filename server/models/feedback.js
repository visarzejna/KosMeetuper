const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const feedbackSchema = new Schema({
    name: {
        type: String,
        required: "Name is Required",
    },
    email: {
        type: String,
        required: "Email is Required",
        // match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/],
      },
    message: {
        type: String,
        required: "Message is Required"
    }
})

module.exports = mongoose.model("Feedback", feedbackSchema);