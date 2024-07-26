const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


const videoRoutes = require('./routes/video');
app.use('/api/videos', videoRoutes);


const searchRoutes = require('./routes/search');
app.use('/api/search', searchRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});