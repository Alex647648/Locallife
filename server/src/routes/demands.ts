import { Router, Request, Response } from 'express';
import { Demand } from '../types';
import { z } from 'zod';

export const demandsRouter = Router();

// In-memory storage (in production, use database)
const demands: Demand[] = [];

// Validation schema
const createDemandSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  category: z.string().min(1),
  location: z.string().min(1),
  budget: z.number().positive(),
  buyerId: z.string().min(1),
  avatarUrl: z.string().url().optional()
});

// GET /api/v1/demands - Get all demands
demandsRouter.get('/', (req: Request, res: Response) => {
  try {
    const { category, location } = req.query;
    
    let filteredDemands = [...demands];
    
    if (category && typeof category === 'string') {
      filteredDemands = filteredDemands.filter(d => d.category === category);
    }
    
    if (location && typeof location === 'string') {
      filteredDemands = filteredDemands.filter(d => 
        d.location.toLowerCase().includes(location.toLowerCase())
      );
    }
    
    res.json({
      success: true,
      data: filteredDemands,
      meta: {
        total: filteredDemands.length
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'INTERNAL_ERROR',
      message: error.message || 'Failed to fetch demands'
    });
  }
});

// POST /api/v1/demands - Create new demand
demandsRouter.post('/', (req: Request, res: Response) => {
  try {
    const validationResult = createDemandSchema.safeParse(req.body);
    
    if (!validationResult.success) {
      return res.status(422).json({
        success: false,
        error: 'VALIDATION_ERROR',
        message: 'Invalid input data',
        details: validationResult.error.errors
      });
    }
    
    const demandData = validationResult.data;
    const newDemand: Demand = {
      id: `d-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...demandData,
      timestamp: Date.now()
    };
    
    demands.push(newDemand);
    
    res.status(201).json({
      success: true,
      data: newDemand
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'INTERNAL_ERROR',
      message: error.message || 'Failed to create demand'
    });
  }
});
