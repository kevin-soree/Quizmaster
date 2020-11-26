const mongoose = require('mongoose');
const Question = require('./question');
const SubmittedAnswer = require('./submitted-answer');

const roundSchema = new mongoose.Schema({
  roundNr: Number,
  questions: [Question],
  teamAnswers: [SubmittedAnswer],
  currentQuestionId: String,
  closed: Boolean
});

exports = mongoose.model('Round', roundSchema);
