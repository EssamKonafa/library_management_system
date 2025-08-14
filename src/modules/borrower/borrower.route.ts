import { Router } from 'express';
import { CreateBorrowerDto } from './dto/create-borrower.dto';
import { UpdateBorrowerDto } from './dto/update-borrower.dto';
import { validateDto } from '../../middlewares/validation.middleware';
import * as borrowerController from './borrower.controller';
import { authenticate } from '../auth/auth.service';

const router = Router();

// All routes below are protected

router.use(authenticate);

// Get all borrowers
router.get('/', borrowerController.findAllBorrowers);

// Get a borrower by ID
router.get('/:id', borrowerController.getBorrowerById);

// Update a borrower
router.patch('/:id', validateDto(UpdateBorrowerDto), borrowerController.updateBorrower);

// Delete a borrower
router.delete('/:id', borrowerController.deleteBorrower);

export default router;
