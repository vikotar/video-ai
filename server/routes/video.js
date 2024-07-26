const express = require('express');
const router = express.Router();
const Video = require('../models/Video');
const upload = require('../services/upload');
const { extractFramesAndSubtitles } = require('../services/videoProcessor');

router.post('/upload', upload.single('video'), async (req, res) => {
  try {
    const video = new Video({
      title: req.body.title,
      path: req.file.path,
    });
    await video.save();

    // Process the video
    const { outputDir, subtitlesExtracted } = await extractFramesAndSubtitles(req.file.path, video._id.toString());
    video.processedDir = outputDir;
    video.hasSubtitles = subtitlesExtracted;
    await video.save();

    res.status(201).json({ message: 'Video uploaded and processed successfully', video });
  } catch (error) {
    res.status(400).json({ message: 'Error uploading or processing video', error });
  }
});

module.exports = router;