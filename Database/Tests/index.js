import mongoose from 'mongoose'

import addTests from './addTests.js';
import getTests from './getTests.js';


mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

let testSchema = new mongoose.Schema({
  discordId: String,
  wpm: Number, 
  accuracy: Number,
  date: Date, 
  promptId: String,
  tp: Number
});

const Test = mongoose.model('Test', testSchema);

export {
  Test,
  addTests,
  getTests,
}
