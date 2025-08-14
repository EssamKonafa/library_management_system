import { Request, Response } from "express";
import * as authService from "./auth.service";
import { CreateBorrowerDto } from "../borrower/dto/create-borrower.dto";

//register new Borrower
export const signup = async (req: Request, res: Response) => {
    try {
        const dto = req.body as CreateBorrowerDto;
        const newBorrower = await authService.signup(dto);
        return res.status(201).json({
            success: true,
            message: "Borrower registered successfully",
            data: newBorrower
        });
    } catch (error: unknown) {
        if (error instanceof Error) {
            return res.status(500).json({
                success: false,
                message: `Error while registering borrower: ${error.message}`
            });
        }
        return res.status(500).json({
            success: false,
            message: "An unexpected error occurred while registering borrower"
        });
    }
};

// signing a registered Borrower
export const signin = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const token = await authService.signin(email, password);
        return res.status(200).json({
            success: true,
            message: "signed in successfully",
            token
        });
    } catch (error: unknown) {
        if (error instanceof Error) {
            const statusCode = error.message === "INVALID CREDENTIALS" || error.message === "Invalid credentials" ? 401 : 500;
            return res.status(statusCode).json({
                success: false,
                message: error.message
            });
        }
        return res.status(500).json({
            success: false,
            message: "An unexpected error occurred during signing in"
        });
    }
};  