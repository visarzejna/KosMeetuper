const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const faqSchema = new Schema({
  question: {
    type: String,
    required: "Question is required!",
  },
  response: {
    type: String,
    required: "Answer is Required!",
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Faq", faqSchema);
