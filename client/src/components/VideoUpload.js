import React, { useState } from 'react';
import axios from 'axios';

const VideoUpload = ({ onVideoUploaded }) => {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('video', file);
    formData.append('title', title);

    try {
      const response = await axios.post('http://localhost:5001/api/videos/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Video uploaded:', response.data);
      onVideoUploaded(response.data.video._id);
      // Reset form
      setFile(null);
      setTitle('');
    } catch (error) {
      console.error('Error uploading video:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="file" onChange={handleFileChange} accept="video/*" required />
      <input type="text" value={title} onChange={handleTitleChange} placeholder="Video title" required />
      <button type="submit">Upload Video</button>
    </form>
  );
};

export default VideoUpload;