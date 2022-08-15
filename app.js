require('dotenv').config();

const express = require('express')
let bodyParser = require('body-parser')
const app = express()

const Test = require('./Database/Test.js')

const TestRoutes = require('./Routes/TestRoutes.js')



const QuickChart = require('quickchart-js');


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


app.use('/test', TestRoutes)



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



app.get('/leaderboards/wpm', async function(req, res) {
  leaderboard = await Test.aggregate([
    {$group: {_id: "$discordId", averageWpm: {$avg: "$wpm"}, averageAcc: {$avg: "$accuracy"}}},
    {$sort: {averageWpm: -1}}
  ]);


  //leaderboard.sort((d1, d2) => ((d1.averageWpm - d2.averageWpm)*-1))
  res.json({lb: leaderboard})
})

app.get('/leaderboards/acc', async function(req, res) {
  leaderboard = await Test.aggregate([
    {$group: {_id: "$discordId", averageWpm: {$avg: "$wpm"}, averageAcc: {$avg: "$accuracy"}}},
    {$sort: {averageAcc: -1}}
  ]);

  res.json({lb: leaderboard})
})

app.listen(process.env.PORT || 3000, () => {
  console.log(`listening on port 3000`)
})


app.get('/:userId/chart', async function(req, res) {
  testList = await Test.aggregate([
    {$match: {discordId: req.params.userId}},
    {$sort: {date: 1}},
  ]);
  
  chart = createChart(testList);

  url = await chart.getShortUrl();
  console.log(url)
  res.json({URL: url});
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
    rank = "Demon"
  } else if (wpm < 130) {
    rank = "Demi God"
  } else if (wpm < 150) {
    rank = "God"
  } else if (wpm < 250) {
    rank = "Untouchable"
  } else if (wpm >= 250) {
    rank = "Suspicious"
  }
  return rank;

}

function createChart(testList) {

  const wpmList = []
  const labels = []
  //wpm = testList.map((item) => item.wpm) 

  //labels = testList.map((item) => item.date.toLocaleDateString('en-US'))
  
  increment = testList.length / 10

  for (i = 0; i < testList.length; i = i + increment) {
    wpmList.push(testList[parseInt(i)].wpm) 
    labels.push(testList[parseInt(i)].date.toLocaleDateString('en-US')) 
  }

  console.log(wpmList)


  chart = new QuickChart();
  chart.setConfig({
    type: 'line',
    data: {labels: labels, datasets: [{label: 'wpm', data: wpmList}]}
  })

  return chart;
}


