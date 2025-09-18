import { NextApiRequest, NextApiResponse } from 'next';
import axios, { AxiosError, AxiosResponseHeaders } from 'axios';
import { getEntityManager } from '../../lib/mickro';
import { RequestHistory } from '../../entities/RequestHistory';
import { HttpRequest, HttpResponse } from '../../types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { method, url, headers = {}, body }: HttpRequest = req.body;

    if (!method || !url) {
      return res.status(400).json({ error: 'Method and URL are required' });
    }

    const startTime = Date.now();
    let response: HttpResponse;
    let axiosResponse: any;

    try {
      const axiosConfig: any = {
        method: method.toLowerCase(),
        url,
        headers,
        timeout: 30000, 
      };

      if (body && (method === 'POST' || method === 'PUT')) {
        axiosConfig.data = body;
      }

      axiosResponse = await axios(axiosConfig);
      
      response = {
        status: axiosResponse.status,
        statusText: axiosResponse.statusText,
        headers: axiosResponse.headers,
        data: axiosResponse.data,
        responseTime: Date.now() - startTime,
        timestamp: new Date(),
      };

    } catch (error) {
      const axiosError = error as AxiosError;
      
      response = {
        status: axiosError.response?.status || 0,
        statusText: axiosError.response?.statusText || 'Request Failed',
        headers: (axiosError.response?.headers || {}) as unknown as AxiosResponseHeaders,
        data: axiosError.response?.data || { error: axiosError.message },
        responseTime: Date.now() - startTime,
        timestamp: new Date(),
      };
    }

    try {
      const em = await getEntityManager();
      
      const requestHistory = new RequestHistory();
      requestHistory.method = method;
      requestHistory.url = url;
      requestHistory.headers = JSON.stringify(headers);
      requestHistory.body = body || null;
      requestHistory.response = JSON.stringify({
        headers: response.headers,
        data: response.data
      });
      requestHistory.statusCode = response.status;
      requestHistory.responseTime = response.responseTime;
      requestHistory.timestamp = response.timestamp;

      await em.persistAndFlush(requestHistory);
    } catch (dbError) {
      console.error('Failed to save request history:', dbError);
    }

    return res.status(200).json(response);

  } catch (error) {
    console.error('Request handler error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}