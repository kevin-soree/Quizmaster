const { notifyScoreboard } = require("./rounds");

const { broadcastToTeams, disconnectTeamsAndQuizMaster } = require("./rounds");

const express = require("express");
const mongoose = require("mongoose");
require("../models/quiz");
require("../models/question");

const router = express.Router();
const Quiz = mongoose.model("Quiz");

router.post("/create", async (req, res, next) => {
	const quizCode = getRandomPassword();

	const quiz = {
		quizCode: quizCode,
		teams: [],
		rounds: [],
		currentRound: 0,
		teamsCanApply: true
	};

	const savedQuizDoc = await Quiz.create(quiz);
	req.session.quiz = {
		_id: savedQuizDoc._id
	};
	req.session.save();
	res.send(savedQuizDoc);
	next();
});

router.post("/:quizCode/connect", async (req, res, next) => {
	if (req.params.quizCode) {
		try {
			const quiz = await Quiz.findOne({ quizCode: req.params.quizCode });
			if (quiz !== null) {
				req.session.quiz = {
					_id: quiz._id,
					type: "scoreboard"
				};
				req.session.save();
				res.send(quiz);
			} else {
				res.status(400).send();
			}
			next();
		} catch (e) {
			next(e);
		}
	}
});

router.patch("/:quizCode", async (req, res, next) => {
	try {
		if (req.params.quizCode && req.body.teamsCanApply !== undefined) {
			const quiz = await Quiz.findOne({ quizCode: req.params.quizCode });
			quiz.teamsCanApply = req.body.teamsCanApply;
			quiz.markModified("teamsCanApply");
			quiz.save();
			res.send();
			next();
		} else if (req.session.quiz._id && req.body.quizEnded === true) {
			broadcastToTeams(req.session.quiz._id, "QuizEnded");
			disconnectTeamsAndQuizMaster(req.session.quiz._id);
			notifyScoreboard(req.session.quiz._id, "QuizEnded");
			res.send();
		}
	} catch (e) {
		console.log(e);
		res.status(400).send(e.message);
	}
});

router.get("/:quizCode", async (req, res, next) => {
	if (req.params.quizCode) {
		try {
			const quiz = await Quiz.findOne({ quizCode: req.params.quizCode });
			res.send(quiz);
			next();
		} catch (e) {
			next(e);
		}
	}
});

function getRandomPassword() {
	let quizCode = "";
	const characters =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	while (quizCode.length < 5) {
		quizCode += characters.charAt(
			Math.floor(Math.random() * characters.length)
		);
	}
	return quizCode;
}

async function getQuestions() {
	const Question = mongoose.model("Question");
	const questionArray = [];
	const questions = await Question.find({}).select({ _id: 1, category: 1 });
	questions.forEach(question => {
		const category = question.category;
		questionArray[question._id] = { category };
	});
}

async function getCategories() {
	const Question = mongoose.model("Question");
	return Question.find({}).distinct("category");
}

async function getRoundQuestions(categories, quizQuestions) {
	const Question = mongoose.model("Question");
	const previousRandomNumbers = [];
	const questions = [];
	quizQuestions.forEach(q => {
		if (categories.some(q.category)) {
			const question = Question.findById(q._id);
			questions.push(question);
		}
	});
	const roundQuestions = [];
	for (let i = 0; i < 12; i++) {
		let randomNr = Math.floor(Math.random() * questions.length);
		while (previousRandomNumbers.includes(randomNr)) {
			randomNr = Math.floor(Math.random() * questions.length);
		}
		previousRandomNumbers.push(randomNr);
		roundQuestions.push(questions[randomNr]);
	}
	return roundQuestions;
}

module.exports = router;
