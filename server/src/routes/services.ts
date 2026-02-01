import { Router, Request, Response } from 'express';
import { Service } from '../types';
import { z } from 'zod';
import { dataStore } from '../services/dataStore';

export const servicesRouter = Router();

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
  imageUrl: z.string().url().optional().or(z.literal('')),
  avatarUrl: z.string().url().optional().or(z.literal('')),
  lat: z.number().min(-90).max(90).optional(),
  lng: z.number().min(-180).max(180).optional(),
  walletAddress: z.string().regex(/^0x[0-9a-fA-F]{40}$/).optional()
});

// GET /api/v1/services - Get all services with optional filtering
servicesRouter.get('/', (req: Request, res: Response) => {
  try {
    const category = typeof req.query.category === 'string' ? req.query.category : undefined;
    const location = typeof req.query.location === 'string' ? req.query.location : undefined;
    
    const services = dataStore.getServices({
      category,
      location
    });
    
    res.json({
      success: true,
      data: services,
      meta: {
        total: services.length
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
    const id = typeof req.params.id === 'string' ? req.params.id : '';
    const service = dataStore.getServiceById(id);
    
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
         details: validationResult.error.issues
       });
     }
    
    const serviceData = validationResult.data;
    const newService: Service = {
      id: `s-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...serviceData
    };
    
    const created = dataStore.addService(newService);
    
    res.status(201).json({
      success: true,
      data: created
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'INTERNAL_ERROR',
      message: error.message || 'Failed to create service'
    });
  }
});

// DELETE /api/v1/services/:id - Delete a service
servicesRouter.delete('/:id', (req: Request, res: Response) => {
  try {
    const id = typeof req.params.id === 'string' ? req.params.id : '';
    const deleted = dataStore.deleteService(id);
    
    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: 'NOT_FOUND',
        message: `Service with id ${id} not found`
      });
    }
    
    res.json({
      success: true,
      message: 'Service deleted successfully'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'INTERNAL_ERROR',
      message: error.message || 'Failed to delete service'
    });
  }
});
