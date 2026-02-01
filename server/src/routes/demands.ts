import { Router, Request, Response } from 'express';
import { Demand } from '../types';
import { z } from 'zod';
import { dataStore } from '../services/dataStore';

export const demandsRouter = Router();

// Validation schema
const createDemandSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  category: z.string().min(1),
  location: z.string().min(1),
  budget: z.number().nonnegative(),
  buyerId: z.string().min(1),
  avatarUrl: z.string().url().optional().or(z.literal('')),
  lat: z.number().min(-90).max(90).optional(),
  lng: z.number().min(-180).max(180).optional()
});

// GET /api/v1/demands - Get all demands
demandsRouter.get('/', (req: Request, res: Response) => {
  try {
    const category = typeof req.query.category === 'string' ? req.query.category : undefined;
    const location = typeof req.query.location === 'string' ? req.query.location : undefined;
    
    const demands = dataStore.getDemands({
      category,
      location
    });
    
    res.json({
      success: true,
      data: demands,
      meta: {
        total: demands.length
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

// GET /api/v1/demands/:id - Get specific demand
demandsRouter.get('/:id', (req: Request, res: Response) => {
  try {
    const id = typeof req.params.id === 'string' ? req.params.id : '';
    const demand = dataStore.getDemandById(id);
    
    if (!demand) {
      return res.status(404).json({
        success: false,
        error: 'NOT_FOUND',
        message: `Demand with id ${id} not found`
      });
    }
    
    res.json({
      success: true,
      data: demand
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'INTERNAL_ERROR',
      message: error.message || 'Failed to fetch demand'
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
         details: validationResult.error.issues
       });
     }
    
    const demandData = validationResult.data;
    const newDemand: Demand = {
      id: `d-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...demandData,
      timestamp: Date.now()
    };
    
    const created = dataStore.addDemand(newDemand);
    
    res.status(201).json({
      success: true,
      data: created
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'INTERNAL_ERROR',
      message: error.message || 'Failed to create demand'
    });
  }
});

// DELETE /api/v1/demands/:id - Delete a demand
demandsRouter.delete('/:id', (req: Request, res: Response) => {
  try {
    const id = typeof req.params.id === 'string' ? req.params.id : '';
    const deleted = dataStore.deleteDemand(id);
    
    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: 'NOT_FOUND',
        message: `Demand with id ${id} not found`
      });
    }
    
    res.json({
      success: true,
      message: 'Demand deleted successfully'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'INTERNAL_ERROR',
      message: error.message || 'Failed to delete demand'
    });
  }
});
