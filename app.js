require('dotenv').config();

const express = require('express')
let bodyParser = require('body-parser')
const app = express()

const mongoose = require('mongoose');


mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

let userSchema = new mongoose.Schema({
  discordId: String,
  username: String,
  tests: [{wpm: Number, accuracy: Number, date: Date}], 
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
    let averages = getAverages(user.tests);
    let rank = getRank(averages[0]);
    res.json({"username": user.username, "averageWpm": averages[0], "averageAcc": averages[1], "tests": user.tests.length, "rank": rank})
  }
})

app.post('/test', async function(req, res) {
  console.log(req.body);
  doc = await User.exists({discordId: req.body.discordId});

  if (doc === null) {
    console.log('user does not exist');
    await res.json({"text": "Register your account to keep track of typing stats!"});

  } else {
    user = await User.findById(doc._id);
    user.tests.push({wpm: Number(req.body.wpm), accuracy: Number(req.body.acc), date: new Date()});
    console.log(user.tests);
    User.updateOne({discordId: req.body.discordId}, {tests: user.tests})
      .then(res.json({"text": 'successful'}));
  }
})

app.listen(process.env.PORT || 3000, () => {
  console.log(`listening on port 3000`)
})

function getAverages(list) {
  console.log(list);
  let avgWpm = 0;
  let avgAcc = 0;
  for (int i = 0; i < list.length; i++) {
    console.log(`${avgWpm} ${avgAcc}`);
    avgWpm += Number(list[i].wpm);
    avgAcc += Number(list[i].accuracy);
  }
  avgWpm = avgWpm / list.length;
  avgAcc = avgAcc / list.length;
  return [avgWpm, avgAcc];
}

function getRank(wpm) {
  let rank = 'Undetermined';
  if (wpm < 50) {
    rank = "Novice"
  } else if (wpm < 60) {
    rank = "Iron"
  } else if (wpm < 70) {
    rank = "Bronze"
  } else if (wpm < 80) {
    rank = "Silver"
  } else if (wpm < 90) {
    rank = "Gold"
  } else if (wpm < 100) {
    rank = "Diamond" 
  } else if (wpm < 110) {
    rank = "Platinum"
  } else if (wpm < 120) {
    rank = "Demon"
  } else if (wpm >= 120) {
    rank = "God"
  }
  return rank;

}
