import { AppDataSource } from "../../config/database";
import { Borrower } from "./borrower.entity";
import { CreateBorrowerDto } from "./dto/create-borrower.dto";
import { UpdateBorrowerDto } from "./dto/update-borrower.dto";

const borrowerRepository = AppDataSource.getRepository(Borrower);

export const findAllBorrowers = async (
    page: number = 1,
    limit: number = 10,
): Promise<[Borrower[], number]> => {

    const skip = (page - 1) * limit;

    const data = borrowerRepository
        .createQueryBuilder('borrower')
        .skip(Number(skip))
        .take(limit)
        .getManyAndCount();

    const [borrowers, total] = await data
    return [borrowers, total] as [Borrower[], number];
};

export const findBorrowerById = async (id: string): Promise<Borrower> => {
    const borrower = await borrowerRepository.findOne({ where: { id } });
    if (!borrower) throw new Error('Borrower not found');
    return borrower;
};

export const updateBorrower = async (id: string, dto: UpdateBorrowerDto): Promise<Borrower> => {
    const borrower = await borrowerRepository.findOne({ where: { id } });
    if (!borrower) throw new Error("Borrower not found");

    borrowerRepository.merge(borrower, dto);
    return await borrowerRepository.save(borrower);
};

export const deleteBorrower = async (id: string): Promise<void> => {
    const borrower = await borrowerRepository.findOne({ where: { id } });
    if (!borrower) throw new Error('Borrower not found');

    await borrowerRepository.delete({ id });
};
