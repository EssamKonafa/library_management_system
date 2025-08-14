import { NextFunction, Request, Response } from "express";

export const wrongEndPoint = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    return res.status(404).json({
        success: false,
        message: `The requested URL ${req.originalUrl} was not found.`
    });
}
