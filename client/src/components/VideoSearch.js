import React, { useState } from 'react';
import axios from 'axios';

const VideoSearch = ({ videoId }) => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(`http://localhost:5001/api/search/${videoId}?query=${query}`);
      setResult(response.data);
    } catch (error) {
      console.error('Error searching video:', error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter your search query"
          required
        />
        <button type="submit">Search</button>
      </form>
      {result && (
        <div>
          <h3>Search Result:</h3>
          {result.type === 'subtitle' ? (
            <div>
              <p>Timestamp: {result.timestamp}</p>
              <p>Text: {result.text}</p>
            </div>
          ) : (
            <div>
              <p>Timestamp: {result.timestamp}</p>
              <img src={`http://localhost:5001/${result.path}`} alt="Video frame" />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VideoSearch;