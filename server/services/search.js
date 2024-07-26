const OpenAI = require("openai");
const fs = require('fs');
const path = require('path');

const openai = new OpenAI({
  apiKey: process.env.OPEN_API_KEY,
});

const generateEmbedding = async (text) => {
  const response = await openai.embeddings.create({
    model: "text-embedding-ada-002",
    input: text,
  });
  return response.data[0].embedding;
};

const cosineSimilarity = (a, b) => {
  const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  return dotProduct / (magnitudeA * magnitudeB);
};

const searchVideo = async (query, videoId) => {
  const queryEmbedding = await generateEmbedding(query);
  const processedDir = path.join('processed', videoId);
  
  // Read and process subtitles
  const subtitlesPath = path.join(processedDir, 'subtitles.srt');
  const subtitles = fs.readFileSync(subtitlesPath, 'utf-8');
  const subtitleLines = subtitles.split('\n\n');
  
  // Read and process frames
  const frameFiles = fs.readdirSync(processedDir).filter(file => file.startsWith('frame-'));
  
  const results = [];

  for (const subtitleBlock of subtitleLines) {
    const [, timestamp, text] = subtitleBlock.split('\n');
    const embedding = await generateEmbedding(text);
    const similarity = cosineSimilarity(queryEmbedding, embedding);
    results.push({ type: 'subtitle', timestamp, text, similarity });
  }

  for (const frameFile of frameFiles) {
    const framePath = path.join(processedDir, frameFile);
    const frameNumber = parseInt(frameFile.match(/frame-(\d+)/)[1]);
    const timestamp = `${frameNumber * 10}:00`; // Assuming 1 frame every 10 seconds
    const embedding = await generateEmbedding(`Image of frame ${frameNumber}`);
    const similarity = cosineSimilarity(queryEmbedding, embedding);
    results.push({ type: 'frame', timestamp, path: framePath, similarity });
  }

  results.sort((a, b) => b.similarity - a.similarity);
  return results[0]; // Return the most relevant result
};

module.exports = { searchVideo };