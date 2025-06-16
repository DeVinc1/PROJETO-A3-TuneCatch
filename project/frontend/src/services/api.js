import axios from 'axios';
import {
  USER_API_BASE_URL,
  BADGES_API_BASE_URL,
  PLAYLIST_API_BASE_URL,
  TAG_API_BASE_URL,
  TRACK_API_BASE_URL,
} from '../config';

export const userApi = axios.create({
  baseURL: USER_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const badgesApi = axios.create({
  baseURL: BADGES_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const playlistApi = axios.create({
  baseURL: PLAYLIST_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const tagApi = axios.create({
  baseURL: TAG_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const trackApi = axios.create({
  baseURL: TRACK_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});