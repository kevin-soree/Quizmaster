const mongoose = require('mongoose');
const Team = require('./team');
const Round = require('./round');
const Question = require('./question');

const quizSchema = new mongoose.Schema({
  quizCode: {
    type: String,
    required: true,
    unique: true
  },
  teams: [Team],
  rounds: [Round],
  questions: [Question],
  currentRound: Number,
  teamsCanApply: Boolean
});

exports = mongoose.model('Quiz', quizSchema);
