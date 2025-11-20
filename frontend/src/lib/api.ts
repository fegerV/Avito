import axios, { AxiosInstance } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add authorization token to requests
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Simple in-memory cache with TTL
interface CacheEntry {
  data: any;
  timestamp: number;
}

const cache = new Map<string, CacheEntry>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export const getCachedData = (key: string): any | null => {
  const entry = cache.get(key);
  if (!entry) return null;
  
  const now = Date.now();
  if (now - entry.timestamp > CACHE_TTL) {
    cache.delete(key);
    return null;
  }
  
  return entry.data;
};

export const setCachedData = (key: string, data: any): void => {
  cache.set(key, {
    data,
    timestamp: Date.now(),
  });
};

export const clearCache = (keyPrefix?: string): void => {
  if (keyPrefix) {
    Array.from(cache.keys()).forEach((key) => {
      if (key.startsWith(keyPrefix)) {
        cache.delete(key);
      }
    });
  } else {
    cache.clear();
  }
};

export default api;
