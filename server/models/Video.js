const mongoose = require('mongoose');

const VideoSchema = new mongoose.Schema({
  title: String,
  path: String,
  uploadDate: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Video', VideoSchema);