import { AxiosResponseHeaders } from "axios";





export interface HttpRequest {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  url: string;
  headers?: Record<string, string>;
  body?: string;
}

export interface HttpResponse {
  status: number;
  statusText: string;
  headers: AxiosResponseHeaders;
  data: any;
  responseTime: number;
  timestamp: Date;
}

export interface RequestHistoryItem {
  id: number;
  method: string;
  url: string;
  headers?: string;
  body?: string;
  response?: string;
  statusCode: number;
  responseTime: number;
  timestamp: Date;
  createdAt: Date;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}