const express = require('express');
const mongoose = require('mongoose');
let webSocketServer;

require('../models/quiz');

const router = express.Router();

const Quiz = mongoose.model('Quiz');

router.get('/', async (req, res, next) => {
  try {
    const Quiz = mongoose.model('Quiz');
    const { teams } = await Quiz.findById(req.session.quiz._id, 'teams');
    res.send(teams);
    next();
  } catch (e) {
    next(e);
  }
});

router.get('/:teamName', async (req, res, next) => {
  if (req.params.teamName) {
    try {
      const Quiz = mongoose.model('Quiz');
      const { teams } = await Quiz.findById(req.session.quiz._id, 'teams');
      const team = teams.find(t => t.name == req.params.teamName);
      if (team) {
        res.send(team);
      } else {
        res.send({ approved: false });
      }
      next();
    } catch (e) {
      next(e);
    }
  } else {
    res.status(400).send('No teamname supplied');
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { quizCode, teamName } = req.body;
    const quiz = await Quiz.findOne({ quizCode: quizCode });
    if (quiz.teams.find(team => team.name.toLowerCase() === teamName.toLowerCase())) {
      return res.status(400).send({error: "Team name is already in use for this quiz!"});
    }
    const team = {
      name: teamName,
      score: 0,
      approved: null
    };
    req.session.quiz = {
      _id: quiz._id,
      team: team.name
    };
    req.session.save();
    quiz.teams.push(team);
    await quiz.save();

    res.send({
      _id: quiz._id,
      quizCode: quiz.quizCode,
      currentRound: quiz.currentRound
    });
    next();
  } catch (e) {
    next(e);
  }
});

function sendToClient(teamName, quizId, type) {
  webSocketServer.clients.forEach(client => {
    if (client.quiz._id === quizId && client.quiz.team === teamName) {
      console.log('sent ' + type + ' to ' + client.quiz.team);
      sendJson(client, { type: type });
    }
  });
}

router.patch('/:teamName', async (req, res, next) => {
  try {
    const Quiz = mongoose.model('Quiz');
    if (req.body.status === false) {
      let quiz = await Quiz.findById(req.session.quiz._id);
      const index = quiz.teams.indexOf(t => t.name === req.params.teamName);
      quiz.teams.splice(index, 1);
      quiz.save();
    } else {
      let quiz = await Quiz.update(
        { 'teams.name': req.params.teamName, _id: req.session.quiz._id },
        { $set: { 'teams.$.approved': req.body.status } }
      );
    }
    sendToClient(
      req.params.teamName,
      req.session.quiz._id,
      'TeamApprovalUpdated'
    );
    res.send();
    next();
  } catch (e) {
    console.log(e);
    res.status(400).send(e);
  }
});

router.patch('/:teamName', async (req, res, next) => {
  try {
    const Quiz = mongoose.model('Quiz');
    if (req.body.status === false) {
      let quiz = await Quiz.findById(req.session.quiz._id);
      const index = quiz.teams.indexOf(t => t.name === req.params.teamName);
      quiz.teams.splice(index, 1);
      quiz.save();
    } else {
      let quiz = await Quiz.update(
        { 'teams.name': req.params.teamName, _id: req.session.quiz._id },
        { $set: { 'teams.$.approved': req.body.status } }
      );
    }
    sendToClient(
      req.params.teamName,
      req.session.quiz._id,
      'TeamApprovalUpdated'
    );
    res.send();
  } catch (e) {
    console.log(e);
    res.status(400).send(e);
  }
});

function setWsServer(wsServer) {
  webSocketServer = wsServer;
}

function sendJson(websocket, object) {
  websocket.send(JSON.stringify(object));
}

module.exports = { router, setWsServer, sendJson };
