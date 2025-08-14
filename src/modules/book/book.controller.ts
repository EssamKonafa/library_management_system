import { Request, Response } from 'express';
import * as bookService from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

export const createBook = async (req: Request, res: Response) => {
    try {
        const dto = req.body as CreateBookDto;
        const newBook = await bookService.createBook(dto);

        return res.status(201).json({
            success: true,
            message: 'Book added successfully',
            data: newBook
        });

    } catch (error: unknown) {
        if (error instanceof Error) {
            return res.status(500).json({
                success: false,
                message: `Error while adding book: ${error.message}`
            });
        }
        return res.status(500).json({
            success: false,
            message: 'An unexpected error occurred while adding book'
        });
    }
};

export const getBooks = async (req: Request, res: Response) => {
    try {
        const { search, page = 1, limit = 10 } = req.query;

        const [data, total] = await bookService.findAllBooks(
            search as string,
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
                message: `Error while fetching books: ${error.message}`
            });
        }
        return res.status(500).json({
            success: false,
            message: 'An unexpected error occurred while fetching books'
        });
    }
};

export const getBookById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const book = await bookService.findBookById(id as string);
        return res.status(200).json({ book });
    } catch (error: unknown) {
        if (error instanceof Error) {
            let statusCode = 500;
            if (error.message === 'Book not found') {
                statusCode = 404;
            }
            return res.status(statusCode).json({
                success: false,
                message: error.message
            });
        }
        return res.status(500).json({
            success: false,
            message: 'An unexpected error occurred while fetching book'
        });
    }
};

export const updateBook = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const dto = req.body as UpdateBookDto;
        const updatedBook = await bookService.updateBook(id as string, dto);

        res.status(200).json({
            success: true,
            message: 'Book updated successfully',
            data: updatedBook
        });
    } catch (error: unknown) {
        if (error instanceof Error) {
            let statusCode = 500;
            if (error.message === 'Book not found') {
                statusCode = 404;
            }
            return res.status(statusCode).json({
                success: false,
                message: error.message
            });
        }
        return res.status(500).json({
            success: false,
            message: 'An unexpected error occurred while updating book'
        });
    }
};

export const deleteBook = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await bookService.deleteBook(id as string);
        return res.status(200).json({
            success: true,
            message: 'Book deleted successfully'
        });
    } catch (error: unknown) {
        if (error instanceof Error) {
            let statusCode = 500;
            if (error.message === 'Book not found') {
                statusCode = 404;
            }
            return res.status(statusCode).json({
                success: false,
                message: error.message
            });
        }
        return res.status(500).json({
            success: false,
            message: 'An unexpected error occurred'
        });
    }
};