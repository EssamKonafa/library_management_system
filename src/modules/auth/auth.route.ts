import { Router } from "express";
import * as authController from "./auth.controller";
import { validateDto } from "../../middlewares/validation.middleware";
import { CreateBorrowerDto } from "../borrower/dto/create-borrower.dto";
import { SigninDto } from "./dto/sign-in.dto";

const router = Router();

//register new Borrower
router.post("/signup", validateDto(CreateBorrowerDto), authController.signup);

// signing a registered Borrower
router.post("/signin", validateDto(SigninDto), authController.signin);

export default router;