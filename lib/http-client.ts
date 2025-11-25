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

export function handleApiError(error: unknown, service: string): never {
  if (error && typeof error === 'object' && 'response' in error) {
    const axiosError = error as { 
      response?: { 
        status: number; 
        data?: { error?: { message?: string } };
      };
      message?: string;
    };
    
    const status = axiosError.response?.status;
    const message = axiosError.response?.data?.error?.message || axiosError.message || 'Unknown error';
    
    if (status === 403) {
      throw new Error(`${service}: API key is invalid or quota exceeded`);
    }
    if (status === 404) {
      throw new Error(`${service}: Resource not found`);
    }
    if (status === 429) {
      throw new Error(`${service}: Rate limit exceeded. Please try again later`);
    }
    
    throw new Error(`${service}: ${message} (Status: ${status || 'unknown'})`);
  }
  
  if (error && typeof error === 'object' && 'request' in error) {
    throw new Error(`${service}: No response received. Check your internet connection`);
  }
  
  if (error && typeof error === 'object' && 'code' in error && error.code === 'ECONNABORTED') {
    throw new Error(`${service}: Request timeout. Please try again`);
  }
  
  const errorMessage = error instanceof Error ? error.message : 'Unknown error';
  throw new Error(`${service}: ${errorMessage}`);
}

