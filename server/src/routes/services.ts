import { Router, Request, Response } from 'express';
import { Service } from '../types';
import { z } from 'zod';

export const servicesRouter = Router();

// In-memory storage (in production, use database)
const services: Service[] = [];

// Validation schemas
const createServiceSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  category: z.string().min(1),
  location: z.string().min(1),
  price: z.number().positive(),
  unit: z.string().min(1),
  sellerId: z.string().min(1),
  tokenAddress: z.string().optional(),
  supply: z.number().optional(),
  imageUrl: z.string().url().optional(),
  avatarUrl: z.string().url().optional()
});

// GET /api/v1/services - Get all services with optional filtering
servicesRouter.get('/', (req: Request, res: Response) => {
  try {
    const { category, location } = req.query;
    
    let filteredServices = [...services];
    
    if (category && typeof category === 'string') {
      filteredServices = filteredServices.filter(s => s.category === category);
    }
    
    if (location && typeof location === 'string') {
      filteredServices = filteredServices.filter(s => 
        s.location.toLowerCase().includes(location.toLowerCase())
      );
    }
    
    res.json({
      success: true,
      data: filteredServices,
      meta: {
        total: filteredServices.length,
        filtered: services.length !== filteredServices.length
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'INTERNAL_ERROR',
      message: error.message || 'Failed to fetch services'
    });
  }
});

// GET /api/v1/services/:id - Get specific service
servicesRouter.get('/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const service = services.find(s => s.id === id);
    
    if (!service) {
      return res.status(404).json({
        success: false,
        error: 'NOT_FOUND',
        message: `Service with id ${id} not found`
      });
    }
    
    res.json({
      success: true,
      data: service
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'INTERNAL_ERROR',
      message: error.message || 'Failed to fetch service'
    });
  }
});

// POST /api/v1/services - Create new service
servicesRouter.post('/', (req: Request, res: Response) => {
  try {
    const validationResult = createServiceSchema.safeParse(req.body);
    
    if (!validationResult.success) {
      return res.status(422).json({
        success: false,
        error: 'VALIDATION_ERROR',
        message: 'Invalid input data',
        details: validationResult.error.errors
      });
    }
    
    const serviceData = validationResult.data;
    const newService: Service = {
      id: `s-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...serviceData,
      timestamp: Date.now()
    } as Service;
    
    services.push(newService);
    
    res.status(201).json({
      success: true,
      data: newService
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'INTERNAL_ERROR',
      message: error.message || 'Failed to create service'
    });
  }
});
