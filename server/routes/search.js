const express = require('express');
const router = express.Router();
const { searchVideo } = require('../services/search');

router.get('/:videoId', async (req, res) => {
  try {
    const { videoId } = req.params;
    const { query } = req.query;
    const result = await searchVideo(query, videoId);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: 'Error searching video', error });
  }
});

module.exports = router;