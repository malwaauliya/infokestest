import { Request, Response, NextFunction } from 'express';

export const Validator = (paramSchema: any) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        let param = req?.body || null
        if(req.method == "GET"){
          param = req?.query || null
        }
        console.log(req.body)
        await paramSchema.validateAsync(param);
        return next();
      } catch (err) {
        const errorMessage = (err as Error).message;
        res.status(400).json({ status: false, message: errorMessage });
      }
  }
};
  