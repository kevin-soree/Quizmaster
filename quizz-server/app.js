const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const ws = require("ws");
const session = require("express-session");
const http = require("http");
const quiz = require("./routes/quizzes");
const questions = require("./routes/questions");
const teams = require("./routes/teams");
const rounds = require("./routes/rounds");
const cors = require("cors");

const dbName = "quizzer";
const app = express();

app.use(cors({ origin: true, credentials: true }));
app.options("*", cors({ origin: true, credentials: true }));

app.use(bodyParser.json());

const sessionParser = session({
	secret: "quizzers",
	cookie: {},
	saveUninitialized: false,
	resave: false
});
app.use(sessionParser);

app.use("/questions", questions);
app.use("/quizzes", quiz);
app.use("/teams", teams.router);
app.use("/rounds", rounds.router);

app.use((err, req, res, next) => {
	console.log("error: " + err.message);
	console.log(err.stack);
	res.status(500).json({
		message: "An unknown error has ocurred",
		error: err.message
	});
});

let server = http.createServer(app);
const webSocketServer = new ws.Server({
	noServer: true
});

server.on("upgrade", (req, networkSocket, head) => {
	sessionParser(req, {}, () => {
		if (req.session.quiz == null|| req.session.quiz._id == null) {
			networkSocket.destroy();
			console.log("Session is invalid, no quiz found!");
			return;
		}

		webSocketServer.handleUpgrade(req, networkSocket, head, newWebSocket => {
			webSocketServer.emit("connection", newWebSocket, req);
		});
	});
});

function sendJson(websocket, object) {
	websocket.send(JSON.stringify(object));
}

webSocketServer.on("connection", (ws, req) => {
	ws.quiz = req.session.quiz;
	webSocketServer.clients.forEach(client => {
		if (client.quiz._id === ws.quiz._id && client.quiz.team === undefined) {
			sendJson(client, { type: "NewTeamJoined" });
		}
	});
	ws.on("message", function(message) {});
});

server = server.listen(4000, () => {
	mongoose.connect(
		`mongodb://localhost:27017/${dbName}`,
		{ useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true },
		() => {
			console.log(`quizzer server started on port ${server.address().port}`);
		}
	);
});

teams.setWsServer(webSocketServer);
rounds.setWsServer(webSocketServer);
