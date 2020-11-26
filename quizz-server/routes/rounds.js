const { sendJson } = require("./teams");

const express = require("express");
const mongoose = require("mongoose");
require("../models/quiz");
require("../models/question");

const Quiz = mongoose.model("Quiz");

let webSocketServer;
const router = express.Router();

router.get("/:roundNr", async (req, res, next) => {
	if (!req.params.roundNr) {
		res.status(400).send("No roundNr given!");
	} else if (req.session.quiz === undefined) {
		res.status(400).send("Invalid session!");
	}
	try {
		const quiz = await Quiz.findOne({ _id: req.session.quiz._id });
		//Get current round
		const currentRoundObject = quiz.rounds[req.params.roundNr - 1];
		if (currentRoundObject === undefined) {
			res.status(400).send("Round could not be found");
		}
		// Get current question
		const currentQuestion = currentRoundObject.questions.find(q => {
			return (
				q._id.toString() === currentRoundObject.currentQuestionId.toString()
			);
		});
		if (currentQuestion === undefined) {
			res.status(400).send("No question could be found");
		}
		res.send({
			currentRound: quiz.currentRound,
			currentQuestion: currentQuestion
		});
		next();
	} catch (e) {
		next(e);
	}
});

router.post("/:roundNr/calculateScores", async (req, res, next) => {
	if (!req.params.roundNr) {
		res.status(400).send("No roundNr given!");
	} else if (req.session.quiz === undefined) {
		res.status(400).send("Invalid session!");
	}
	try {
		const quiz = await Quiz.findOne({ _id: req.session.quiz._id });
		const currentRound = quiz.rounds[req.params.roundNr - 1];
		if (currentRound === undefined) {
			res.status(400).send("Round could not be found");
		}

		// get amount of correct answers per team in this round.
		let correctAnswersPerTeam = [];

		for (const team of quiz.teams) {
			const correctAnswers = currentRound.teamAnswers.filter(
				ta => ta.teamName === team.name && ta.correctAnswer
			);
			const amountOfCorrectAnswers = correctAnswers ? correctAnswers.length : 0;

			correctAnswersPerTeam.push({
				teamName: team.name,
				amountOfCorrectAnswers: amountOfCorrectAnswers
			});
		}
		// sort by amount
		const sortedResults = correctAnswersPerTeam.sort(
			(a, b) => b.amountOfCorrectAnswers - a.amountOfCorrectAnswers
		);
		sortedResults.forEach((capt, index) => {
			let roundScore = 0;
			// award place [0, 1, 2] this amount of points: [4, 2, 1], respectively, the rest 0.1
			switch (index) {
				case 0:
					roundScore = 4;
					break;
				case 1:
					roundScore = 2;
					break;
				case 2:
					roundScore = 1;
					break;
				default:
					roundScore = 0.1;
					break;
			}
			let team = quiz.teams.find(team => team.name === capt.teamName);
			team.score += roundScore;
		});
		quiz.markModified("teams");
		await quiz.save();
		broadcastToTeams(req.session.quiz._id, 'RoundEnded');
		notifyScoreboard(req.session.quiz._id);
		return res.send();
	} catch (e) {
		console.log(e);
		next(e);
	}
});

router.post("/", async (req, res, next) => {
	if (!req.session.quiz || !req.body.questions || !req.body.currentQuestionId) {
		res.status(400).send("Invalid parameters!");
	}
	try {
		const Quiz = mongoose.model("Quiz");
		const questions = req.body.questions;
		const currentQuestionId = req.body.currentQuestionId;
		const quiz = await Quiz.findById(req.session.quiz._id);
		const roundNr = quiz.rounds ? quiz.rounds.length + 1 : 1;
		!quiz.rounds ? (quiz.rounds = []) : quiz.rounds;
		const round = {
			roundNr: roundNr,
			questions: questions,
			currentQuestionId: currentQuestionId,
			closed: false,
			teamAnswers: []
		};
		quiz.currentRound++;
		quiz.rounds.push(round);
		await quiz.save();
		broadcastToTeams(req.session.quiz._id, "RoundStarted");
		notifyScoreboard(req.session.quiz._id);
		res.send(round);
		next();
	} catch (e) {
		next(e);
	}
});

router.post("/:roundNr/submittedAnswers", async (req, res, next) => {
	try {
		const roundNr = req.params.roundNr;
		const Quiz = mongoose.model("Quiz");
		const quiz = await Quiz.findById(req.session.quiz._id);
		if (quiz.rounds[roundNr - 1].closed === true) {
			return res.status(400).send({error: "The question is closed!"});
		}
		const submittedAnswer = {
			questionId: quiz.rounds[roundNr - 1].currentQuestionId,
			teamName: req.session.quiz.team,
			answer: req.body.answer,
			correctAnswer: undefined
		};
		quiz.rounds[roundNr - 1].teamAnswers.push(submittedAnswer);
		quiz.markModified("rounds");
		await quiz.save();
		broadcastToQuizMaster(req.session.quiz._id, "NewAnswerSubmitted");
		notifyScoreboard(req.session.quiz._id);
		res.send({ message: "Answer sucessfully submitted!" });
		next();
	} catch (e) {
		next(e);
	}
});

router.get("/:roundNr/submittedAnswers", async (req, res, next) => {
	try {
		const roundNr = req.params.roundNr;
		const quiz = await Quiz.findById(req.session.quiz._id);
		const round = quiz.rounds[roundNr - 1];
		if (!round) {
			res.status(400).send("Round not found!");
		}
		if (!round.teamAnswers) {
			res.send([]);
		}
		const questionAnswers = round.teamAnswers.filter(
			submittedAnswer => submittedAnswer.questionId === round.currentQuestionId
		);
		res.send(questionAnswers);
	} catch (e) {
		next(e);
	}
});

router.patch("/:roundNr/submittedAnswers", async (req, res, next) => {
	const roundNr = req.params.roundNr;
	let teamName = null;
	if (req.session.quiz.team != null) teamName = req.session.quiz.team;
	if (req.body.teamName != null) teamName = req.body.teamName;
	else if (req.session.quiz.team == null && req.body.teamName == null)
		res.status(400).send({error: "Team name is not set!"});
	try {
		const Quiz = mongoose.model("Quiz");
		const quiz = await Quiz.findById(req.session.quiz._id);
		const round = quiz.rounds[roundNr - 1];
		if (round.closed === true && req.body.answer) {
			res.status(400).send({error: "The question is closed!" });
			return;
		}
		const currentQuestion = round.questions.find(q => {
			return q._id === round.currentQuestionId;
		});

		let index = round.teamAnswers.findIndex(
			teamAnswer =>
				teamAnswer.teamName === teamName &&
				teamAnswer.questionId === currentQuestion._id
		);
		// Check if the PATCH call is to change an answer or to evaluate the answer
		if (req.body.correctAnswer !== undefined) {
			quiz.rounds[roundNr - 1].teamAnswers[index].correctAnswer =
				req.body.correctAnswer;
			quiz.markModified("rounds");
			await quiz.save();
			res.send({ message: "Answer evaluated!" });
		} else if (req.body.answer) {
			quiz.rounds[roundNr - 1].teamAnswers[index].answer = req.body.answer;
			quiz.rounds[roundNr - 1].teamAnswers[index].correctAnswer = null;
			quiz.markModified("rounds");
			await quiz.save();
			broadcastToQuizMaster(req.session.quiz._id, "NewAnswerSubmitted");
			res.send({ message: "Answer changed!" });
		} else {
			res.status(400).send({ message: "Invalid patch call!" });
		}
		notifyScoreboard(req.session.quiz._id);
	} catch (e) {
		next(e);
	}
});

router.patch("/:roundNr/questions", async (req, res, next) => {
	const roundNr = req.params.roundNr;
	const closed = req.body.closed;
	try {
		const Quiz = mongoose.model("Quiz");
		const quiz = await Quiz.findById(req.session.quiz._id);
		quiz.rounds[roundNr - 1].closed = closed;
		quiz.markModified("rounds");
		await quiz.save();
		notifyScoreboard(req.session.quiz._id);
		res.send({ message: "Question closed!" });
		next();
	} catch (e) {
		next(e);
	}
});

// Next question
router.put("/:roundId/questions", async (req, res, next) => {
	const roundId = req.params.roundId;
	const currentQuestionId = req.body.currentQuestionId;
	try {
		const Quiz = mongoose.model("Quiz");
		const quiz = await Quiz.findById(req.session.quiz._id);
		// Mark question as used
		quiz.rounds[roundId - 1].questions.find(
			q => q._id === currentQuestionId
		).isUsed = true;
		// Update currentquestionid in round
		quiz.rounds[roundId - 1].currentQuestionId = currentQuestionId;
		quiz.rounds[roundId - 1].closed = false;
		quiz.markModified("rounds");
		await quiz.save();
		broadcastToTeams(req.session.quiz._id, "NextQuestion");
		notifyScoreboard(req.session.quiz._id);
		res.send({ message: "Next Question!" });
		next();
	} catch (e) {
		next(e);
	}
});

router.get("/:roundId/currentQuestion", async (req, res, next) => {
	const roundId = req.params.roundId;
	try {
		const Quiz = mongoose.model("Quiz");
		const quiz = await Quiz.findById(req.session.quiz._id);
		const currentQuestionId = quiz.rounds[roundId].currentQuestionId;
		const currentQuestion = quiz.rounds[roundId].questions.find(
			question => question._id === currentQuestionId
		);
		res.send(currentQuestion);
		next();
	} catch (e) {
		next(e);
	}
});

function broadcastToTeams(quizId, type) {
	webSocketServer.clients.forEach(client => {
		if (client.quiz._id === quizId && client.quiz.team !== undefined) {
			sendJson(client, { type: type });
		}
	});
}

function broadcastToQuizMaster(quizId, type) {
	webSocketServer.clients.forEach(client => {
		if (client.quiz._id === quizId && client.quiz.team === undefined) {
			console.log(`sending to ${client.quiz._id}`);
			sendJson(client, { type: type });
		}
	});
}

function disconnectTeamsAndQuizMaster(quizId) {
	webSocketServer.clients.forEach(client => {
		if (client.quiz._id === quizId && client.quiz.type !== "scoreboard") {
			client.close();
		}
	});
}

function notifyScoreboard(quizId, type = "tick") {
	webSocketServer.clients.forEach(client => {
		if (client.quiz._id === quizId && client.quiz.type === "scoreboard") {
			if (type === "QuizEnded") {
				console.log("Notifying scoreboard game end");
			}
			sendJson(client, { type: type });
		}
	});
}

function setWsServer(wsServer) {
	webSocketServer = wsServer;
}

module.exports = {
	router,
	setWsServer,
	broadcastToTeams,
	disconnectTeamsAndQuizMaster,
	notifyScoreboard
};
