const express = require('express')
const router = express.Router()
const Test = require('../Database/Test.js');
const QuickChart = require('quickchart-js');

router.get('/wpm/:userId', async function(req, res) {
  testList = await Test.aggregate([
    {$match: {discordId: req.params.userId}},
    {$sort: {date: -1}},
    {$limit: 10}
  ]);

  chart = createChart(getDataList(testList, 'wpm'))
  
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

function getDataList(testList, attribute) {
  testList = testList.reverse()
  const dataset = []
  const labels = []
 

  for (i = 0; i < testList.length; i++) {
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

function createCompareChart(dataList1, name1, dataList2, name2) {
  chart = new QuickChart();
  chart.setConfig({
    type: 'line',
    data: {labels: dataList1.labels, datasets: [{label: name1, data: dataList1.data, fill: false}, {label: name2, data: dataList2.data, fill: false}]}
  })

  return chart
}


