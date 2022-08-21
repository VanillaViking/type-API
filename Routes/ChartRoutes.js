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

router.get('/wpm/:userId1/:userId2', async function(req, res) {
  testList1 = await Test.aggregate([
    {$match: {discordId: req.params.userId1}},
    {$sort: {date: 1}},
  ]);

  testList2 = await Test.aggregate([
    {$match: {discordId: req.params.userId2}},
    {$sort: {date: 1}},
  ]);


  chart = createCompareChart(getDataList(testList1, 'wpm'), "user1", getDataList(testList2, 'wpm'), "user2")

  url = await chart.getShortUrl();
  res.json({URL: url})


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

function createCompareChart(dataList1, name1, dataList2, name2) {
  chart = new QuickChart();
  chart.setConfig({
    type: 'line',
    data: {labels: dataList1.labels, datasets: [{label: name1, data: dataList1.data}, {label: name2, data: dataList2.data}]}
  })

  return chart
}


