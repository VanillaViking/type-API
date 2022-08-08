require('dotenv').config();

const express = require('express')
let bodyParser = require('body-parser')
const app = express()

const mongoose = require('mongoose');


mongoose.connect('mongodb+srv://ashwinr2k2:ubi7gsta9b@cluster0.qsxprhr.mongodb.net/MyDatabase?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });

let userSchema = new mongoose.Schema({
  discordId: String,
  username: String,
  tests: [Number], 
});

const User = mongoose.model('User', userSchema);

app.use(bodyParser.json());

app.use(function(req, res, next) {
  console.log(req.method + " " + req.path + " - " + req.ip);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.get('/', (req, res) => {
  res.send('Hello World!')
});

app.get('/:userId/stats', async function(req, res) {
  doc = await User.exists({discordId: req.params.userId});
  if (doc === null) {
    await res.json(null);
  } else {
    user = await User.findById(doc._id);
    let avg = user.tests.reduce((total, num) => {return total + num}, 0) / user.tests.length;
    let rank = getRank(avg);
    res.json({"username": user.username, "average": avg, "tests": user.tests.length, rank: rank})
  }
})


app.listen(process.env.PORT || 3000, () => {
  console.log(`listening on port 3000`)
})


function getRank(avg) {
  let rank = 'Undetermined';
  if (avg < 50) {
    rank = "Novice"
  } else if (avg < 60) {
    rank = "Iron"
  } else if (avg < 70) {
    rank = "Bronze"
  } else if (avg < 80) {
    rank = "Silver"
  } else if (avg < 90) {
    rank = "Gold"
  } else if (avg < 100) {
    rank = "Diamond" 
  } else if (avg < 110) {
    rank = "Platinum"
  } else if (avg < 120) {
    rank = "Demon"
  } else if (avg >= 120) {
    rank = "God"
  }
  return rank;

}
