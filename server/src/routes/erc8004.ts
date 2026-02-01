import { Router, Request, Response } from 'express';
import {
  listAgents,
  getAgentDetail,
  getReputationSummary,
} from '../services/erc8004Service';

export const erc8004Router = Router();

erc8004Router.get('/agents', async (req: Request, res: Response) => {
  const page = Math.max(1, parseInt(String(req.query.page ?? '1'), 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(String(req.query.limit ?? '20'), 10) || 20));

  try {
    const result = await listAgents(page, limit);
    res.json({ success: true, data: result, meta: { page, limit } });
  } catch (err) {
    res.status(502).json({
      success: false,
      error: 'FETCH_FAILED',
      message: (err as Error).message,
    });
  }
});

erc8004Router.get('/agents/:agentId', async (req: Request, res: Response) => {
  const agentId = Array.isArray(req.params.agentId) ? req.params.agentId[0] : req.params.agentId;
  if (!agentId || !/^\d+$/.test(agentId)) {
    res.status(400).json({
      success: false,
      error: 'VALIDATION_ERROR',
      message: 'agentId must be a positive integer',
    });
    return;
  }

  try {
    const detail = await getAgentDetail(agentId);
    if (!detail) {
      res.status(404).json({
        success: false,
        error: 'NOT_FOUND',
        message: `Agent ${agentId} not found`,
      });
      return;
    }
    res.json({ success: true, data: detail });
  } catch (err) {
    res.status(502).json({
      success: false,
      error: 'FETCH_FAILED',
      message: (err as Error).message,
    });
  }
});

erc8004Router.get('/agents/:agentId/reputation', async (req: Request, res: Response) => {
  const agentId = Array.isArray(req.params.agentId) ? req.params.agentId[0] : req.params.agentId;
  if (!agentId || !/^\d+$/.test(agentId)) {
    res.status(400).json({
      success: false,
      error: 'VALIDATION_ERROR',
      message: 'agentId must be a positive integer',
    });
    return;
  }

  try {
    const summary = await getReputationSummary(agentId);
    res.json({ success: true, data: summary });
  } catch (err) {
    res.status(502).json({
      success: false,
      error: 'FETCH_FAILED',
      message: (err as Error).message,
    });
  }
});
