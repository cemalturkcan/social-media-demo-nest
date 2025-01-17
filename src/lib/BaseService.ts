import { axiosInstance as axios } from './axios';
import * as process from 'node:process';

interface BaseServiceParams {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  url: string;
  baseUrl?: string;
  params?: Record<string, any>;
  data?: any;
  headers?: Record<string, string>;
}

interface BaseServiceResponse {
  data: any;
  status: number;
}

export async function BaseService({
  method,
  url,
  baseUrl = process.env.OLLAMA_API_URL,
  params,
  data,
  headers = { 'Content-Type': 'application/json' },
}: BaseServiceParams): Promise<BaseServiceResponse> {
  const response = await axios({
    method,
    url,
    baseURL: baseUrl,
    params,
    data,
    headers,
  });
  return {
    data: response.data,
    status: response.status,
  };
}
