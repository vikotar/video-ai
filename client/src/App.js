import React, { useState } from 'react';
import VideoUpload from './components/VideoUpload';
import VideoSearch from './components/VideoSearch';

function App() {
  const [uploadedVideoId, setUploadedVideoId] = useState(null);

  const handleVideoUploaded = (videoId) => {
    setUploadedVideoId(videoId);
  };

  return (
    <div className="App">
      <h1>Video Search App</h1>
      <VideoUpload onVideoUploaded={handleVideoUploaded} />
      {uploadedVideoId && <VideoSearch videoId={uploadedVideoId} />}
    </div>
  );
}

export default App;