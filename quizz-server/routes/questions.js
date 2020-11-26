const express = require("express");
const mongoose = require("mongoose");
require("../models/question");
const Question = mongoose.model("Question");

const router = express.Router();

router.get("/", async (req, res, next) => {
	try {
		const questions = await Question.find({});

		res.send(
			questions.map(q => {
				q.isUsed = false;
				return q;
			})
		);
	} catch (e) {
		next(e);
	}
});

module.exports = router;
