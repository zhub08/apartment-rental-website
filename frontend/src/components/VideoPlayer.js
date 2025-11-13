import React from 'react';

const VideoPlayer = ({ videoURL }) => {
  if (!videoURL) {
    return null;
  }

  // Function to get embed URL for YouTube or Vimeo
  const getEmbedUrl = (url) => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const videoId = url.split('v=')[1] || url.split('youtu.be/')[1];
      return `https://www.youtube.com/embed/${videoId}`;
    } else if (url.includes('vimeo.com')) {
      const videoId = url.split('vimeo.com/')[1];
      return `https://player.vimeo.com/video/${videoId}`;
    }
    return null;
  };

  const embedUrl = getEmbedUrl(videoURL);

  if (!embedUrl) {
    return <p>Invalid video URL provided.</p>;
  }

  return (
    <div className="video-player mt-4">
      <h3 className="text-xl font-bold mb-2">Video Tour</h3>
      <iframe
        width="560"
        height="315"
        src={embedUrl}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title="Video Tour"
        className="w-full aspect-video"
      ></iframe>
    </div>
  );
};

export default VideoPlayer;
