import * as dotenv from "dotenv";
dotenv.config();

console.log(process.env)
import express from "express"
import bodyParser from "body-parser"

const app = express()

import {
  TestRoutes,
  //StatsRoutes,
  //LeaderboardRoutes,
  //ChartRoutes,
  //AdminRoutes,
  //WebsiteRoutes,
} from "./Routes/index.js"

app.use(bodyParser.json());

// apply CORS middleware
// currently accepts requests from everywhere
// TODO: change this to only accept localhost
app.use(function(req, res, next) {
  console.log(req.method + " " + req.path + " - " + req.ip);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

//ROUTES-----------------------------------

app.use('/test', TestRoutes)
//app.use('/stats', StatsRoutes)
//app.use('/leaderboards', LeaderboardRoutes)
//app.use('/chart', ChartRoutes)
//app.use('/admin', AdminRoutes)
//app.use('/zyenyo', WebsiteRoutes)

//-----------------------------------------

app.listen(process.env.PORT || 3000, () => {
  console.log(`listening...`)
})


