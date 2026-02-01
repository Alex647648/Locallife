import { Router, Request, Response } from 'express';
import { dataStore } from '../services/dataStore';

export const adminRouter = Router();

// GET /api/v1/admin/stats - Get data statistics
adminRouter.get('/stats', (req: Request, res: Response) => {
  try {
    const services = dataStore.getServices();
    const demands = dataStore.getDemands();
    const orders = dataStore.getOrders();
    
    // Count items with real coordinates
    const servicesWithCoords = services.filter(s => s.lat !== undefined && s.lng !== undefined).length;
    const demandsWithCoords = demands.filter(d => d.lat !== undefined && d.lng !== undefined).length;
    
    res.json({
      success: true,
      data: {
        services: {
          total: services.length,
          withCoordinates: servicesWithCoords,
          byCategory: services.reduce((acc, s) => {
            acc[s.category] = (acc[s.category] || 0) + 1;
            return acc;
          }, {} as Record<string, number>)
        },
        demands: {
          total: demands.length,
          withCoordinates: demandsWithCoords,
          byCategory: demands.reduce((acc, d) => {
            acc[d.category] = (acc[d.category] || 0) + 1;
            return acc;
          }, {} as Record<string, number>)
        },
        orders: {
          total: orders.length
        }
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'INTERNAL_ERROR',
      message: error.message || 'Failed to get stats'
    });
  }
});

// POST /api/v1/admin/reset - Reset all data to initial state
adminRouter.post('/reset', (req: Request, res: Response) => {
  try {
    dataStore.reset();
    
    res.json({
      success: true,
      message: 'Data reset to initial state successfully'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'INTERNAL_ERROR',
      message: error.message || 'Failed to reset data'
    });
  }
});
