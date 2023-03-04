import express from 'express'
const router = express.Router()
import { Test } from '../Database/Tests/index.js'
import Prompt from '../Database/Prompts/index.js'

router.post('/add/prompt', async function(req, res) {
  let testPrompt = new Prompt({text: req.body.text})  

  testPrompt.save().then(res.json({text: "Successful"}))
})

router.get('/find/cheaters', async function(req, res) {
  users = await Test.aggregate([
    {$match: {wpm: {$gte: 250}}},
    {$sort: {wpm: -1}}
  ])

  res.json({users: users})
})

router.get('/remove/cheatedtests', async function(req, res) {
  Test.deleteMany({wpm: {$gte: 250}})
    .then(res.json({text: "done"}))
})

router.get('/remove/:userId', async function(req, res) {
  Test.deleteMany({discordId: req.params.userId})
    .then(res.json({text: "Successful"}))
})

export default router
