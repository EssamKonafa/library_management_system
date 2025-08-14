import { Router } from 'express';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { validateDto } from '../../middlewares/validation.middleware';
import * as bookController from './book.controller';

const router = Router();

// Create a new book
router.post('/', validateDto(CreateBookDto), bookController.createBook);

// Get all books
router.get('/', bookController.getBooks);

// Get a book by ID
router.get('/:id', bookController.getBookById);

// Update a book
router.patch('/:id', validateDto(UpdateBookDto), bookController.updateBook);

// Delete a book
router.delete('/:id', bookController.deleteBook);

export default router;