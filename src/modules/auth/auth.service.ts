import { Request, Response, NextFunction } from "express";
import { AppDataSource } from "../../config/database";
import { Borrower } from "../borrower/borrower.entity";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { CreateBorrowerDto } from "../borrower/dto/create-borrower.dto";

const borrowerRepository = AppDataSource.getRepository(Borrower);

//putting sensitive values like this is not secure but it is only for assessment if the env are not loaded successfully
const JWT_SECRET = process.env.JWT_SECRET || "2b$10$gfOKYfxhN8ug3T3nhU8AZ"; 

//register new Borrower
export const signup = async (dto: CreateBorrowerDto): Promise<Borrower> => {
    
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const borrower = borrowerRepository.create({ ...dto, password: hashedPassword });
    return await borrowerRepository.save(borrower);
};

// signing a registered Borrower
export const signin = async (
    email: string,
    password: string
): Promise<string> => {

    const borrower = await borrowerRepository.findOne({ where: { email } });
    if (!borrower) throw new Error("INVALID CREDENTIALS");

    const isValid = await bcrypt.compare(password, borrower.password);
    if (!isValid) throw new Error("Invalid credentials");

    const payload = { id: borrower.id, email: borrower.email }

    const token = jwt.sign(
        payload,
        JWT_SECRET,
        { expiresIn: "1h" }
    );
    return token;
};

//auth middleware
export const authenticate = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const token = authHeader.split(" ")[1] as any;
        const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string };
        (req as any).user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Unauthorized" });
    }
};