import axios from 'axios';
import * as process from 'node:process';

const apiClient = axios.create({
  timeout: 1000000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  paramsSerializer: {
    indexes: null,
  },
});

export const axiosInstance = apiClient;
