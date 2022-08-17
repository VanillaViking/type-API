const express = require('express')
const router = express.Router()
const Test = require('../Database/Test.js');
const Prompt = require('../Database/Prompt.js');

router.post('/add/prompt', async function(req, res) {
  let testPrompt = new Prompt({text: req.body.text})  

  testPrompt.save().then(res.json({text: "Successful"}))
})

module.exports = router
