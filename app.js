require('dotenv').config();

const express = require('express')
let bodyParser = require('body-parser')
const app = express()

const mongoose = require('mongoose');


mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

let userSchema = new mongoose.Schema({
  discordId: String,
  username: String,
  tests: [Number], 
});

const User = mongoose.model('User', userSchema);

app.use(bodyParser.json());

app.use(function(req, res, next) {
  console.log(req.method + " " + req.path + " - " + req.ip);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.get('/', (req, res) => {
  res.send('Hello World!')
});

app.get('/:userId/stats', async function(req, res) {
  doc = await User.exists({discordId: req.params.userId});
  if (doc === null) {
    await res.json(null);
  } else {
    user = await User.findById(doc._id);
    let avg = user.tests.reduce((total, num) => {return total + num}, 0) / user.tests.length;
    res.json({"username": user.username, "average": avg, "tests": user.tests.length})
  }
})

app.listen(process.env.PORT || 3000, () => {
  console.log(`listening on port 3000`)
})
