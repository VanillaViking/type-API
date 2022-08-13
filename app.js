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

app.get('/:userId/stats', async function(req, res) {

    console.log(req.params.userId)
    tests = await Test.aggregate([
      { $match: { discordId: req.params.userId } },
      {$group: {_id: "$discordId", averageWpm: {$avg: "$wpm"}, averageAcc: {$avg: "$accuracy"}, tests: {$sum: 1}, bestWpm: {$max: "$wpm"}, deviation: {$stdDevPop: "$wpm"}}}
    ]);

    console.log(tests)
    if (tests.length != 0) {
      tests[0].rank = getRank(tests[0].averageWpm)
      res.json(tests[0]) 
    } else {
      res.json(null)
    }
})

app.get('/:userId/stats/recent', async function(req, res) {
    recentAvg = await Test.aggregate([
      {$match: {discordId: req.params.userId}},
      {$sort: {date: -1}},
      {$limit: 10},
      {$group: {_id: "$discordId", averageWpm: {$avg: "$wpm"}, averageAcc: {$avg: "$accuracy"}, bestWpm: {$max: "$wpm"}, deviation: {$stdDevPop: "$wpm"} }}
    ]);

    console.log(recentAvg)
    if (recentAvg.length != 0) {
      recentAvg[0].rank = getRank(recentAvg[0].averageWpm)
      res.json(recentAvg[0])
    } else {
      res.json(null)
    }


})


app.post('/:userId/test', async function(req, res) {
  console.log(req.body);
  
  let test = new Test({discordId: req.params.userId, wpm: req.body.wpm, accuracy: req.body.accuracy, date: new Date()});
  test.save()
    .then(res.json({text: "Successful"}))

})

app.get('/:userId/remove', async function(req, res) {
  Test.deleteMany({discordId: req.params.userId})
    .then(res.json({text: "Successful"}))

})

app.get('/leaderboards/wpm', async function(req, res) {
  leaderboard = await Test.aggregate([
    {$group: {_id: "$discordId", averageWpm: {$avg: "$wpm"}, averageAcc: {$avg: "$accuracy"}}},
    {$sort: {averageWpm: -1}}
  ]);

  //leaderboard.sort((d1, d2) => ((d1.averageWpm - d2.averageWpm)*-1))
  res.json({lb: leaderboard})
  console.log("hello")
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

