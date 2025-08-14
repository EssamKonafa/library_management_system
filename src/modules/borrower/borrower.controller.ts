import { Request, Response } from 'express';
import * as borrowerService from './borrower.service';
import { CreateBorrowerDto } from './dto/create-borrower.dto';
import { UpdateBorrowerDto } from './dto/update-borrower.dto';

export const findAllBorrowers = async (req: Request, res: Response) => {
    try {
        const { page = 1, limit = 10 } = req.query;

        const [data, total] = await borrowerService.findAllBorrowers(
            Number(page),
            Number(limit),
        );
        const totalPages = Math.ceil(Number(total) / Number(limit))
        return res.status(200).json({
            data,
            total,
            currentPage: Number(page),
            limit: Number(limit),
            totalPages,
            hasNextPage: Number(page) < totalPages,
            hasPreviousPage: Number(page) > 1
        });
    } catch (error: unknown) {
        if (error instanceof Error) {
            return res.status(500).json({
                success: false,
                message: `Error while fetching borrowers: ${error.message}`
            });
        }
        return res.status(500).json({
            success: false,
            message: 'An unexpected error occurred while fetching borrowers'
        });
    }
};

export const getBorrowerById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const borrower = await borrowerService.findBorrowerById(id as string);
        return res.status(200).json({ data: borrower });
    } catch (error: unknown) {
        if (error instanceof Error) {
            const statusCode = error.message === 'Borrower not found' ? 404 : 500;
            return res.status(statusCode).json({
                success: false,
                message: error.message
            });
        }
        return res.status(500).json({
            success: false,
            message: 'An unexpected error occurred while fetching borrower'
        });
    }
};

export const updateBorrower = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const dto = req.body as UpdateBorrowerDto;
        const updatedBorrower = await borrowerService.updateBorrower(id as string, dto);

        return res.status(200).json({
            success: true,
            message: 'Borrower updated successfully',
            data: updatedBorrower
        });
    } catch (error: unknown) {
        if (error instanceof Error) {
            const statusCode = error.message === 'Borrower not found' ? 404 : 500;
            return res.status(statusCode).json({
                success: false,
                message: error.message
            });
        }
        return res.status(500).json({
            success: false,
            message: 'An unexpected error occurred while updating borrower'
        });
    }
};

export const deleteBorrower = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await borrowerService.deleteBorrower(id as string);

        return res.status(200).json({
            success: true,
            message: 'Borrower deleted successfully'
        });
    } catch (error: unknown) {
        if (error instanceof Error) {
            const statusCode = error.message === 'Borrower not found' ? 404 : 500;
            return res.status(statusCode).json({
                success: false,
                message: error.message
            });
        }
        return res.status(500).json({
            success: false,
            message: 'An unexpected error occurred while deleting borrower'
        });
    }
};
