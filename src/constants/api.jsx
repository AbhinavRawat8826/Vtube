import axios from 'axios';

const request = axios.create({
  baseURL: 'https://youtube.googleapis.com/youtube/v3/',
  params: {
    key: import.meta.env.VITE_YOUTUBE_API_KEY,
  },
});

export const getVideoDetails = async (_videoId) => {
  const cachedData = sessionStorage.getItem(`video-details-${_videoId}`);
  if (cachedData) {
    return JSON.parse(cachedData);
  }

  const { data: { items } } = await request.get('/videos', {
    params: {
      part: 'contentDetails,statistics',
      id: _videoId,
    },
  });

  if (items.length) {
    sessionStorage.setItem(`video-details-${_videoId}`, JSON.stringify(items[0]));
    return items[0];
  }

  throw new Error('Video details not found');
};

export const getChannelIcon = async (channelId) => {
  const cachedData = sessionStorage.getItem(`channel-icon-${channelId}`);
  if (cachedData) {
    return JSON.parse(cachedData);
  }

  const { data: { items } } = await request.get('/channels', {
    params: {
      part: 'snippet',
      id: channelId,
    },
  });

  if (items.length) {
    sessionStorage.setItem(`channel-icon-${channelId}`, JSON.stringify(items[0].snippet.thumbnails.default));
    return items[0].snippet.thumbnails.default;
  }

  throw new Error('Channel icon not found');
};

export default request;
