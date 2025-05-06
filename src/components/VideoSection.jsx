// src/components/VideoSection.jsx
import React, { useState } from "react";
import PropTypes from "prop-types";

const VideoSection = ({ videoUrl, width = "100%", height = "400px" }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  // Extract video ID from YouTube URL
  const getVideoId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const videoId = getVideoId(videoUrl);
  const embedUrl = `https://www.youtube.com/embed/${videoId}`;

  if (!videoId) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <p className="text-gray-500 dark:text-gray-400">Invalid video URL</p>
      </div>
    );
  }

  // Google search URL construction
  const googleSearchUrl = searchQuery
    ? `https://www.google.com/search?q=${encodeURIComponent(
        `${searchQuery} ${videoId}`
      )}`
    : "";

  return (
    <div className="space-y-6">
      <div className="w-full flex justify-center my-8">
        <div
          className="relative overflow-hidden rounded-lg shadow-lg"
          style={{ width, height }}
        >
          <iframe
            width="100%"
            height="100%"
            src={embedUrl}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute top-0 left-0 w-full h-full"
          />
        </div>
      </div>

      {/* New Google search integration */}
      <div className="max-w-2xl mx-auto p-4 bg-gray-50 rounded-lg">
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Google for video-related content..."
            className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={() => setShowSearch(true)}
            disabled={!searchQuery.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
          >
            Search
          </button>
        </div>

        {showSearch && searchQuery && (
          <div className="border rounded-lg overflow-hidden">
            <iframe
              src={googleSearchUrl}
              title="Google Search Results"
              width="100%"
              height="500"
              frameBorder="0"
              className="min-h-[500px]"
              sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
            />
          </div>
        )}
      </div>
    </div>
  );
};

VideoSection.propTypes = {
  videoUrl: PropTypes.string.isRequired,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default VideoSection;
