import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { setupInterceptors } from '@core/network/interceptors';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'https://api.example.com/v1';

export interface ApiClient {
  get<T>(url: string, config?: AxiosRequestConfig): Promise<T>;
  post<T>(url: string, body?: unknown, config?: AxiosRequestConfig): Promise<T>;
  put<T>(url: string, body?: unknown, config?: AxiosRequestConfig): Promise<T>;
  patch<T>(url: string, body?: unknown, config?: AxiosRequestConfig): Promise<T>;
  delete<T>(url: string, config?: AxiosRequestConfig): Promise<T>;
}

class AxiosApiClient implements ApiClient {
  constructor(private client: AxiosInstance) {}

  async get<T>(url: string, c?: AxiosRequestConfig) {
    return (await this.client.get<T>(url, c)).data;
  }
  async post<T>(url: string, b?: unknown, c?: AxiosRequestConfig) {
    return (await this.client.post<T>(url, b, c)).data;
  }
  async put<T>(url: string, b?: unknown, c?: AxiosRequestConfig) {
    return (await this.client.put<T>(url, b, c)).data;
  }
  async patch<T>(url: string, b?: unknown, c?: AxiosRequestConfig) {
    return (await this.client.patch<T>(url, b, c)).data;
  }
  async delete<T>(url: string, c?: AxiosRequestConfig) {
    return (await this.client.delete<T>(url, c)).data;
  }
}

export function createApiClient(): ApiClient {
  const instance = axios.create({ baseURL: BASE_URL });
  setupInterceptors(instance);
  return new AxiosApiClient(instance);
}
