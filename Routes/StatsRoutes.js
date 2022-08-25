const express = require('express')
const router = express.Router()
const Test = require('../Database/Test.js');

router.get('/global/:userId', async function(req, res) {
    tests = await Test.aggregate([
      { $match: { discordId: req.params.userId } },
      {$group: {_id: "$discordId", averageWpm: {$avg: "$wpm"}, averageAcc: {$avg: "$accuracy"}, tests: {$sum: 1}, bestWpm: {$max: "$wpm"}, deviation: {$stdDevPop: "$wpm"}}}
    ]);

    if (tests.length != 0) {
      tests[0].rank = getRank(tests[0].averageWpm)
      res.json(tests[0]) 
    } else {
      res.json(null)
    }
})

router.get('/recent/:userId', async function(req, res) {
    recentAvg = await Test.aggregate([
      {$match: {discordId: req.params.userId}},
      {$sort: {date: -1}},
      {$limit: 10},
      {$group: {_id: "$discordId", averageWpm: {$avg: "$wpm"}, averageAcc: {$avg: "$accuracy"}, bestWpm: {$max: "$wpm"}, deviation: {$stdDevPop: "$wpm"}}}
    ]);

    recentAvg[0].weightedTp = await getWeightedTp(req.params.userId)

    if (recentAvg.length != 0) {
      recentAvg[0].rank = getRank(recentAvg[0].averageWpm)
      res.json(recentAvg[0])
    } else {
      res.json(null)
    }

})

module.exports = router

async function getWeightedTp(id) {
  tpList = await Test.aggregate([
    {$match: {discordId: id, tp: {$exists: true}}},
    {$sort: {tp: -1}},
    {$limit: 100}
  ]);
    
    weightedTp = 0
    for (i = 0; i < tpList.length; i++) {
      weightedTp += (tpList[i].tp * Math.pow(0.95, i))
    }
  return weightedTp
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
