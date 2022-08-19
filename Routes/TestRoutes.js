const express = require('express')
const router = express.Router()
const Test = require('../Database/Test.js');


router.post('/add/:userId', async function(req, res) {
  let test = new Test({discordId: req.params.userId, wpm: req.body.wpm, accuracy: req.body.accuracy, date: new Date()});

  test.save().then(res.json({text: "Successful"}))

}) 

module.exports = router
