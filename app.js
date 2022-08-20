require('dotenv').config();

const express = require('express')
let bodyParser = require('body-parser')
const app = express()

const TestRoutes = require('./Routes/TestRoutes.js')
const StatsRoutes = require('./Routes/StatsRoutes.js')
const LeaderboardRoutes = require('./Routes/LeaderboardRoutes.js')
const ChartRoutes = require('./Routes/ChartRoutes.js')
const AdminRoutes = require('./Routes/AdminRoutes.js')
const WebsiteRoutes = require('./Routes/WebsiteRoutes.js')

app.use(bodyParser.json());
app.use(function(req, res, next) {
  console.log(req.method + " " + req.path + " - " + req.ip);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

//ROUTES-----------------------------------

app.use('/test', TestRoutes)
app.use('/stats', StatsRoutes)
app.use('/leaderboards', LeaderboardRoutes)
app.use('/chart', ChartRoutes)
app.use('/admin', AdminRoutes)
app.use('/zyenyo', WebsiteRoutes)

//-----------------------------------------

app.listen(process.env.PORT || 3000, () => {
  console.log(`listening...`)
})


