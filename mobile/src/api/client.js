import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// EXPO_PUBLIC_* env vars are inlined by Metro at build time - see .env.
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:4000';

export const TOKEN_STORAGE_KEY = 'feedants.authToken';

const client = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 15000,
});

client.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem(TOKEN_STORAGE_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Normalizes every failure into { message, code, status } so screens never
// have to know axios's or the backend's error shape.
export function parseApiError(error) {
  if (error.response) {
    const { data, status } = error.response;
    return {
      status,
      message: data?.error?.message || 'Something went wrong',
      code: data?.error?.code || 'UNKNOWN_ERROR',
    };
  }
  if (error.request) {
    return { status: 0, message: 'Could not reach the server. Check your connection.', code: 'NETWORK_ERROR' };
  }
  return { status: 0, message: error.message || 'Something went wrong', code: 'UNKNOWN_ERROR' };
}

export default client;
