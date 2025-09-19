import { NextApiRequest, NextApiResponse } from "next";
import { getEntityManager } from "../../../lib/mickro";
import { RequestHistory } from "../../../entities/RequestHistory";
import { PaginatedResponse, RequestHistoryItem } from "../../../types";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = (req.query.search as string) || "";
    const method = (req.query.method as string) || "";

    const em = await getEntityManager();
    const repo = em.getRepository(RequestHistory);

    const where: any = {};
    if (search) {
      where.url = { $like: `%${search}%` };
    }
    if (method) {
      where.method = method;
    }

    const [results, total] = await repo.findAndCount(where, {
      limit,
      offset: (page - 1) * limit,
      orderBy: { createdAt: "DESC" },
    });

    const response: PaginatedResponse<RequestHistoryItem> = {
      data: results.map((item) => ({
        id: Number(item.id),
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
    console.error("History handler error:", error);
    return res.status(500).json({
      error: "Internal server error",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
 