require('dotenv').config();

const express = require('express')
let bodyParser = require('body-parser')
const app = express()

const mongoose = require('mongoose');


mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

let testSchema = new mongoose.Schema({
  discordId: String,
  wpm: Number, 
  accuracy: Number,
  date: Date, 
});

const Test = mongoose.model('Test', testSchema);

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

/*app.post('/register', async (req, res) => {
  doc = await User.exists({discordId: req.body.discordId});
  console.log(doc);
  console.log(doc === null);

  if (!(doc === null)) {
    res.json({"text": `User already exists.`})  
  } else {
    let user = new User({discordId: req.body.discordId, tests: []});
    user.save()
      .then(() => res.json({"text": `Successfully registered user.`}))

  }
}); */

app.get('/:userId/stats', async function(req, res) {

    tests = await Test.aggregate([
      { $match: { discordId: req.params.userId } },
      {$group: {_id: "$discordId", averageWpm: {$avg: "$wpm"}, averageAcc: {$avg: "$accuracy"}}}
    ]);


    //let averages = getAverages(user.tests);
    //let rank = getRank(averages[0]);
    tests[0].rank = getRank(tests[0].averageWpm)
    res.json(tests[0]) 
})

app.post('/test', async function(req, res) {
  console.log(req.body);
  
  let test = new Test({discordId: req.body.discordId, wpm: req.body.wpm, accuracy: req.body.accuracy, date: new Date()});
  test.save()
    .then(res.json({text: "Successful."}))

})

app.get('/leaderboards/wpm', async function(req, res) {
  users = await User.find({});
  let leaderboard = [];
  
  
})




app.listen(process.env.PORT || 3000, () => {
  console.log(`listening on port 3000`)
})



function getAverages(list) {
  console.log(list);
  let avgWpm = 0;
  let avgAcc = 0;
  for (let test in list) {
    console.log(`${avgWpm} ${avgAcc}`);
    avgWpm += Number(list[test].wpm);
    avgAcc += Number(list[test].accuracy);
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

/*  doc = await User.exists({discordId: req.body.discordId});

  if (doc === null) {
    console.log('user does not exist');
    await res.json({"text": "Register your account to keep track of typing stats!"});

  } else {
    user = await User.findById(doc._id);
    user.tests.push({wpm: Number(req.body.wpm), accuracy: Number(req.body.acc), date: new Date()});
    console.log(user.tests);
    User.updateOne({discordId: req.body.discordId}, {tests: user.tests})
      .then(res.json({"text": 'successful'}));
  } */

