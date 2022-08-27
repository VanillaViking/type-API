const express = require('express')
const router = express.Router()
const Test = require('../Database/Test.js');
const User = require('../Database/User.js');


router.post('/add/:userId', async function(req, res) {
  let test = new Test({discordId: req.params.userId, wpm: req.body.wpm, accuracy: req.body.accuracy, tp: req.body.tp, date: new Date()});
  
  await test.save()

  weightedTp = await getWeightedTp(req.params.userId)
  user = await User.findOneAndUpdate({discordId: req.params.userId}, {totalTp: weightedTp})

  //create new user if doesn't exist
  if (user === null) {
    newUser = new User({discordId: req.params.userId, totalTp: weightedTp})
    await newUser.save()
  }
      
  res.json({rawTpIncrease: weightedTp - user.totalTp})

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

