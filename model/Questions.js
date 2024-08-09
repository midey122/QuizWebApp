const mongoose = require("mongoose");
const questionSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  options: {
    type: [String],
    required: true,
    validate: {
      validator: (v) => {
        return v && v.length >= 2 && v.length > 0;
      },
      message: (props) => `At least two options are required for a question.`,
    },
  },
  answer: {
    type: String,
    required: true,
  },
});

const Questions = mongoose.model("Question", questionSchema);
module.exports = Questions;
