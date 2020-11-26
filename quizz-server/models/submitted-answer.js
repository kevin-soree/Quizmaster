const mongoose = require('mongoose');

const submittedAnswerSchema = new mongoose.Schema({
  questionId: String,
  teamName: String,
  answer: String,
  correctAnswer: Boolean
});

exports = mongoose.model('SubmittedAnswer', submittedAnswerSchema);
