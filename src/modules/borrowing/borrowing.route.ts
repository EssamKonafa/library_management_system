import { Router } from "express";
import { validateDto } from "../../middlewares/validation.middleware";
import { CreateBorrowedBookDto } from "./dto/create-borrowing.dto";
import * as borrowingController from "./borrowing.controller";
import { limiter } from "../../middlewares/rate-limit.middleware";

const router = Router();

// Get all borrowed books
// applied rate limit dummy case: 10 request per 1 minute
router.get('/', limiter, borrowingController.findAllBorrowedBooks);

// Make a new borrow
router.post('/checkout', limiter, validateDto(CreateBorrowedBookDto), borrowingController.makeBorrow);

// Return a borrowed book
router.patch('/return', borrowingController.returnBorrowedBook);

// Get all overdue books
router.get('/overdue', borrowingController.findOverdueBooks);

// Download borrowing report
router.get('/report', borrowingController.downloadBorrowingReport);

// Get overdue borrows for last month
router.get('/overdue-last-month', borrowingController.getOverdueBorrowsLastMonth);

// Get all borrows for last month
router.get('/all-borrows-last-month', borrowingController.getAllBorrowsLastMonth);

// Get borrowed books by borrower ID
router.get('/borrower/:borrowerId', borrowingController.findBorrowedBooksByBorrower);


export default router;