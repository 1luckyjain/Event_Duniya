import { Request, Response, NextFunction } from 'express';

export const validateFields = (requiredFields: string[]) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      console.log('Request body:', req.body);
      console.log('Required fields:', requiredFields);
      
      const missingFields = requiredFields.filter(field => {
        const value = req.body[field] || req.params[field];
        return value === undefined || value === null || value === '';
      });
      
      if (missingFields.length > 0) {
        res.status(400).json({
          success: false,
          message: `Missing required fields: ${missingFields.join(', ')}`
        });
        return;
      }
      
      next();
    } catch (error) {
      next(error);
    }
  };
};
