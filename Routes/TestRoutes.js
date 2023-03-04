import express from 'express'
const router = express.Router()
import { Test, addTests } from '../Database/Tests/index.js'
import User from '../Database/Users/index.js'

router.post('/add/:userId', async function(req, res) {

  console.log(req.body);

  const result = await addTests({
    tests: [{
      discordId: req.params.userId,
      ...req.body
    }]
  });

  console.log(result)

  weightedTp = await getWeightedTp(req.params.userId)
  user = await User.findOneAndUpdate({discordId: req.params.userId}, {totalTp: weightedTp})

  //create new user if doesn't exist
  if (user === null) {
    newUser = new User({discordId: req.params.userId, totalTp: weightedTp})
    await newUser.save()
  }
      
  res.json({rawTpIncrease: weightedTp - user.totalTp})

}) 

export default router

async function getWeightedTp(id) {
  tpList = await Test.aggregate([
    {$match: {discordId: id, tp: {$exists: true}}},
    {$sort: {tp: -1}},
    {$limit: 100}
  ]);
    
    let weightedTp = 0
    for (i = 0; i < tpList.length; i++) {
      weightedTp += (tpList[i].tp * Math.pow(0.95, i))
    }
  return weightedTp
}

