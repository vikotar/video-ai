const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const path = require('path');
const fs = require('fs');

ffmpeg.setFfmpegPath(ffmpegPath);

const extractFrames = async (videoPath, outputDir) => {
  return new Promise((resolve, reject) => {
    ffmpeg(videoPath)
      .outputOptions('-vf fps=1/10') // Extract one frame every 10 seconds
      .output(path.join(outputDir, 'frame-%d.jpg'))
      .on('end', () => {
        console.log('Frame extraction complete');
        resolve();
      })
      .on('error', (err) => {
        console.error('Error extracting frames:', err);
        reject(err);
      })
      .run();
  });
};

const extractSubtitles = async (videoPath, outputDir) => {
  return new Promise((resolve) => {
    ffmpeg(videoPath)
      .output(path.join(outputDir, 'subtitles.srt'))
      .outputOptions('-c:s srt')
      .on('end', () => {
        console.log('Subtitle extraction complete');
        resolve(true);
      })
      .on('error', (err) => {
        console.warn('Warning: Unable to extract subtitles. The video may not contain subtitle data.');
        resolve(false);
      })
      .run();
  });
};

const extractFramesAndSubtitles = async (videoPath, videoId) => {
  const outputDir = path.join('processed', videoId);
  fs.mkdirSync(outputDir, { recursive: true });

  try {
    await extractFrames(videoPath, outputDir);
    const subtitlesExtracted = await extractSubtitles(videoPath, outputDir);
    
    return {
      outputDir,
      subtitlesExtracted
    };
  } catch (error) {
    console.error('Error in video processing:', error);
    throw error;
  }
};

module.exports = { extractFramesAndSubtitles };