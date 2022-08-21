const express = require('express')
const router = express.Router()
const Test = require('../Database/Test.js');
const QuickChart = require('quickchart-js');

router.get('/wpm/:userId', async function(req, res) {
  testList = await Test.aggregate([
    {$match: {discordId: req.params.userId}},
    {$sort: {date: 1}},
  ]);

  chart = createChart(getDataList(testList, 'wpm'))
  
  url = await chart.getShortUrl();
  console.log(url)
  res.json({URL: url});
})

module.exports = router

function getDataList(testList, attribute) {
  const dataset = []
  const labels = []
 
  increment = testList.length / 10

  for (i = 0; i < testList.length; i = i + increment) {
    dataset.push(testList[parseInt(i)][attribute]) 
    labels.push(testList[parseInt(i)].date.toLocaleDateString('en-US')) 
  }

  return { data: dataset, labels: labels }
}

function createChart(dataList) {

  chart = new QuickChart();
  chart.setConfig({
    type: 'line',
    data: {labels: dataList.labels, datasets: [{label: 'wpm', data: dataList.data}]}
  })

  return chart;
}




