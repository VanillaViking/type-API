const express = require('express')
const router = express.Router()
const Test = require('../Database/Test.js');
const QuickChart = require('quickchart-js');

router.get('/wpm/:userId', async function(req, res) {
  testList = await Test.aggregate([
    {$match: {discordId: req.params.userId}},
    {$sort: {date: 1}},
  ]);
  
  chart = createChart(testList);

  url = await chart.getShortUrl();
  console.log(url)
  res.json({URL: url});
})

module.exports = router

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




