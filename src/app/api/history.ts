import { NextApiRequest, NextApiResponse } from 'next';
import { getEntityManager } from '../../lib/mickro';
import { RequestHistory } from '../../entities/RequestHistory';
import { PaginatedResponse, RequestHistoryItem } from '../../types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string || '';
    const method = req.query.method as string || '';

    const em = await getEntityManager();
    
    // Build query with filters
    const qb = em.createQueryBuilder(RequestHistory, 'rh');
    
    if (search) {
      qb.andWhere('rh.url LIKE ?', [`%${search}%`]);
    }
    
    if (method) {
      qb.andWhere('rh.method = ?', [method]);
    }

    // Get total count for pagination
    const totalQuery = qb.clone();
    const total = await totalQuery.getCount();

    // Get paginated results
    const offset = (page - 1) * limit;
    const results = await qb
      .orderBy({ createdAt: 'DESC' })
      .limit(limit)
      .offset(offset)
      .getResult();

    const response: PaginatedResponse<RequestHistoryItem> = {
      data: results.map(item => ({
        id: item.id,
        method: item.method,
        url: item.url,
        headers: item.headers,
        body: item.body,
        response: item.response,
        statusCode: item.statusCode,
        responseTime: item.responseTime,
        timestamp: item.timestamp,
        createdAt: item.createdAt,
      })),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };

    return res.status(200).json(response);

  } catch (error) {
    console.error('History handler error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}