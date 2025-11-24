import axios, { AxiosInstance } from 'axios';
import { API_TIMEOUT } from './config';

export function createHttpClient(): AxiosInstance {
  return axios.create({
    timeout: API_TIMEOUT,
    headers: {
      'User-Agent': 'YouTube-Idea-Generator/1.0',
    },
  });
}

export function handleApiError(error: any, service: string): never {
  if (error.response) {
    const status = error.response.status;
    const message = error.response.data?.error?.message || error.message;
    
    if (status === 403) {
      throw new Error(`${service}: API key is invalid or quota exceeded`);
    }
    if (status === 404) {
      throw new Error(`${service}: Resource not found`);
    }
    if (status === 429) {
      throw new Error(`${service}: Rate limit exceeded. Please try again later`);
    }
    
    throw new Error(`${service}: ${message} (Status: ${status})`);
  }
  
  if (error.request) {
    throw new Error(`${service}: No response received. Check your internet connection`);
  }
  
  if (error.code === 'ECONNABORTED') {
    throw new Error(`${service}: Request timeout. Please try again`);
  }
  
  throw new Error(`${service}: ${error.message}`);
}

