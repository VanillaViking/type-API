const express = require('express')
const router = express.Router()
const Test = require('../Database/Test.js');

router.get('/wpm/average', async function(req, res) {
  leaderboard = await Test.aggregate([
    {$group: {_id: "$discordId", averageWpm: {$avg: "$wpm"}, averageAcc: {$avg: "$accuracy"}}},
    {$sort: {averageWpm: -1}}
  ]);

  res.json({lb: leaderboard})
}) 

router.get('/acc/average', async function(req, res) {
  leaderboard = await Test.aggregate([
    {$group: {_id: "$discordId", averageWpm: {$avg: "$wpm"}, averageAcc: {$avg: "$accuracy"}}},
    {$sort: {averageAcc: -1}}
  ]);

  res.json({lb: leaderboard})
})

module.exports = router
