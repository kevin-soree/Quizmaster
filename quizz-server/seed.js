const mongoose = require('mongoose');
const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);
require('./models/question');

const dbName = 'quizzer';

const Question = mongoose.model('Question');

mongoose.connect(`mongodb://localhost:27017/${dbName}`, {useNewUrlParser: true})
    .then(async () => {
        return await seedQuestion();
    }).catch(err => {
        console.log(err);
    }).finally(() => {
        db.close();
    });

async function seedQuestion() {
    await Question.deleteMany();
    const questionData = await readFile('./quizrvagen/Questions.json', 'utf8');
    await Question.insertMany(JSON.parse(questionData));
}