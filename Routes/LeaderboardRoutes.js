const express = require('express')
const router = express.Router()
const Test = require('../Database/Test.js');
const User = require('../Database/User.js');


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

router.get('/wpm/best', async function(req, res) {
  leaderboard = await Test.aggregate([
    {$group: {_id: "$discordId", bestWpm: {$max: "$wpm"}}},
    {$sort: {bestWpm: -1}}
  ]);

  res.json({lb: leaderboard})
}) 

router.get('/tp/total', async function(req, res) {
  leaderboard = await User.find({}).sort({totalTp: -1})

  res.json({lb: leaderboard})
}) 

router.get('/:statistic', async function(req, res) {
  
})

module.exports = router
