const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

let promptSchema = new mongoose.Schema({
  text: String
});

const Prompt = mongoose.model('Prompt', promptSchema);

module.exports = Prompt
