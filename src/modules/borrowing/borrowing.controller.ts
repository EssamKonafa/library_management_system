import { Request, Response } from "express";
import { CreateBorrowedBookDto } from "./dto/create-borrowing.dto";
import * as borrowerService from './borrowing.service'
import { DateTime } from 'luxon';

export const findAllBorrowedBooks = async (req: Request, res: Response) => {
    try {
        const { page = 1, limit = 10 } = req.query;

        const [data, total] = await borrowerService.findAllBorrowedBooks(
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
                message: `Error while fetching borrowed books: ${error.message}`
            });
        }
        return res.status(500).json({
            success: false,
            message: 'An unexpected error occurred while fetching borrowed books'
        });
    }
};

export const makeBorrow = async (req: Request, res: Response) => {
    try {
        const dto = req.body as CreateBorrowedBookDto;
        const newBorrowedBook = await borrowerService.makeBorrow(dto);

        return res.status(201).json({
            success: true,
            message: 'Book borrowed successfully',
            data: newBorrowedBook
        });
    } catch (error: unknown) {
        if (error instanceof Error) {
            switch (error.message) {
                case 'BOOK_ALREADY_BORROWED':
                    return res.status(409).json({
                        success: false,
                        message: 'This book is already borrowed by this borrower and has not been returned yet.'
                    });
                case 'BOOK_UNAVAILABLE':
                    return res.status(400).json({
                        success: false,
                        message: 'This book is not available for borrowing.'
                    });
                default:
                    return res.status(500).json({
                        success: false,
                        message: `Error while borrowing book: ${error.message}`
                    });
            }
        }
        return res.status(500).json({
            success: false,
            message: 'An unexpected error occurred while borrowing book'
        });
    }
};

export const returnBorrowedBook = async (req: Request, res: Response) => {
    try {
        const { borrowerId, bookId } = req.body;
        await borrowerService.returnBorrowedBook(borrowerId as string, bookId as string);
        return res.status(200).json({
            success: true,
            message: 'Book returned successfully',
        });
    } catch (error: unknown) {
        if (error instanceof Error) {
            switch (error.message) {
                case 'BORROWED_BOOK_NOT_FOUND':
                    return res.status(404).json({
                        success: false,
                        message: 'Borrowed book not found.'
                    });
                case 'BOOK_ALREADY_RETURNED':
                    return res.status(400).json({
                        success: false,
                        message: 'This book has already been returned.'
                    });
                default:
                    return res.status(500).json({
                        success: false,
                        message: `Error while returning book: ${error.message}`
                    });
            }
        }
        return res.status(500).json({
            success: false,
            message: 'An unexpected error occurred while returning book'
        });
    }
};

export const findOverdueBooks = async (req: Request, res: Response) => {
    try {
        const { page = 1, limit = 10 } = req.query;

        const [data, total] = await borrowerService.findOverdueBooks(
            Number(page),
            Number(limit)
        );

        const totalPages = Math.ceil(Number(total) / Number(limit));

        return res.status(200).json({
            success: true,
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
                message: `Error while fetching overdue books: ${error.message}`
            });
        }
        return res.status(500).json({
            success: false,
            message: 'An unexpected error occurred while fetching overdue books'
        });
    }
};

export const findBorrowedBooksByBorrower = async (req: Request, res: Response) => {
    try {
        const { borrowerId } = req.params;
        const { page = 1, limit = 10 } = req.query;

        const [data, total] = await borrowerService.findBorrowedBooksByBorrower(
            borrowerId as string,
            Number(page),
            Number(limit)
        );
        const totalPages = Math.ceil(Number(total) / Number(limit));
        return res.status(200).json({
            success: true,
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
                message: `Error while fetching borrowed books by borrower: ${error.message}`
            });
        }
        return res.status(500).json({
            success: false,
            message: 'An unexpected error occurred while fetching borrowed books by borrower'
        });
    }
};

export const downloadBorrowingReport = async (req: Request, res: Response) => {
    try {
        const { startDate, endDate } = req.query;

        if (!startDate || !endDate) {
            return res.status(400).json({ success: false, message: 'Start date and end date are required for the report.' });
        }

        const start = DateTime.fromISO(startDate as string).toJSDate();
        const end = DateTime.fromISO(endDate as string).toJSDate();

        const data = await borrowerService.getBorrowingReport(
            start,
            end
        );

        const buffer = await borrowerService.exportBorrowingReportXlsx(data);
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=borrowing-report.xlsx');
        return res.send(buffer);

    } catch (error: unknown) {
        return res.status(500).json({ success: false, message: 'Failed to generate report' });
    }
};

export const getOverdueBorrowsLastMonth = async (req: Request, res: Response) => {
    try {
        const buffer = await borrowerService.getOverdueBorrowsLastMonth();
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=overdue-borrows-last-month.xlsx');
        return res.send(buffer);
    } catch (error: unknown) {
        return res.status(500).json({ success: false, message: 'Failed to generate overdue borrows report for last month' });
    }
};

export const getAllBorrowsLastMonth = async (req: Request, res: Response) => {
    try {
        const buffer = await borrowerService.getAllBorrowsLastMonth();
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=all-borrows-last-month.xlsx');
        return res.send(buffer);
    } catch (error: unknown) {
        return res.status(500).json({ success: false, message: 'Failed to generate all borrows report for last month' });
    }
};
