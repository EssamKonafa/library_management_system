import { Request, Response, NextFunction } from 'express';
import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';

//dto validation
export const validateDto = (dtoClass: any) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const dto = plainToInstance(dtoClass, req.body);
            const errors = await validate(dto);

            if (errors.length > 0) {
                const errorMessages = errors.map((error: ValidationError) => ({
                    property: error.property,
                    constraints: error.constraints
                }));

                return res.status(400).json({
                    message: 'Validation failed',
                    errors: errorMessages
                });
            }

            req.body = dto; //replace body data with the validated
            next();
        } catch (error: unknown) {
            if (error instanceof Error) {
                return res.status(500).json({
                    success: false,
                    message: error.message
                });
            }
            return res.status(500).json({
                success: false,
                message: 'An unexpected error occurred during validation'
            });
        }
    };
};