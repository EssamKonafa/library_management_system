import { Between, IsNull, LessThan } from "typeorm";
import { AppDataSource } from "../../config/database";
import { BorrowedBook } from "./borrowing.entity";
import { CreateBorrowedBookDto } from "./dto/create-borrowing.dto";
import { Book } from "../book/book.entity";
import { BorrowStatus } from "./enum/borrow-status.enum";
import { DateTime } from 'luxon';
import ExcelJS from 'exceljs';

const borrowingRepository = AppDataSource.getRepository(BorrowedBook);

const lastMonthStart = DateTime.now().minus({ months: 1 }).startOf('month').toJSDate();
const lastMonthEnd = DateTime.now().minus({ months: 1 }).endOf('month').toJSDate();
const timeNow = DateTime.now().toJSDate()

export const findAllBorrowedBooks = async (
    page: number = 1,
    limit: number = 10,
): Promise<[BorrowedBook[], number]> => {

    const skip = (page - 1) * limit;

    const data = borrowingRepository
        .createQueryBuilder('borrowed_book')
        .leftJoinAndSelect('borrowed_book.borrower', 'borrower')
        .leftJoinAndSelect('borrowed_book.book', 'book')
        .skip(Number(skip))
        .take(limit)
        .getManyAndCount();

    const [borrowedBooks, total] = await data
    return [borrowedBooks, total] as [BorrowedBook[], number];
};

export const makeBorrow = async (dto: CreateBorrowedBookDto) => {

    return await AppDataSource.transaction(async (manager) => {

        const existingBorrow = await borrowingRepository.findOne({
            where: {
                book: { id: dto.book },
                borrower: { id: dto.borrower },
                returnedAt: IsNull()
            },
        });

        if (existingBorrow) throw new Error('BOOK_ALREADY_BORROWED');

        const book = await manager.getRepository(Book).findOne({
            where: { id: dto.book },
            select: ['availableQuantity'],
        })

        if (!book || book.availableQuantity <= 0) throw new Error('BOOK_UNAVAILABLE');

        await manager
            .createQueryBuilder()
            .update(Book)
            .set({ availableQuantity: () => "availableQuantity - 1" })
            .where("id = :id", { id: dto.book })
            .execute();

        const borrowedBook = manager.getRepository(BorrowedBook).create(dto as any);
        return await manager.getRepository(BorrowedBook).save(borrowedBook);
    });
};

export const returnBorrowedBook = async (borrowerId: string, bookId: string) => {

    const borrowedBook = await borrowingRepository.findOne({
        where: {
            borrower: { id: borrowerId },
            book: { id: bookId },
            returnedAt: IsNull()
        },
        relations: ['book']
    })
    console.log(borrowedBook);

    if (!borrowedBook) throw new Error('BORROWED_BOOK_NOT_FOUND');

    if (borrowedBook.status === BorrowStatus.RETURNED) throw new Error('BOOK_ALREADY_RETURNED');

    return await AppDataSource.transaction(async (manager) => {

        const returnedAt = DateTime.now().toJSDate();

        await manager
            .createQueryBuilder()
            .update(BorrowedBook)
            .set({
                status: BorrowStatus.RETURNED,
                returnedAt,
            })
            .where("id = :id", { id: borrowedBook.id })
            .execute();

        await manager
            .createQueryBuilder()
            .update(Book)
            .set({ availableQuantity: () => "availableQuantity + 1", })
            .where("id = :id", { id: borrowedBook.book.id })
            .execute();
    });
};

export const findOverdueBooks = async (
    page: number = 1,
    limit: number = 10
) => {
    const skip = (page - 1) * limit;

    const [books, total] = await borrowingRepository.findAndCount({
        where: {
            dueDate: LessThan(timeNow),
            returnedAt: IsNull()
        },
        relations: ['borrower', 'book'],
        skip,
        take: limit,
        order: {
            dueDate: 'ASC'
        }
    });

    return [books, total];
};

export const findBorrowedBooksByBorrower = async (
    borrowerId: string,
    page: number = 1,
    limit: number = 10
) => {

    const skip = (page - 1) * limit;

    const [books, total] = await borrowingRepository.findAndCount({
        where: {
            borrower: { id: borrowerId },
            returnedAt: IsNull(),
        },
        relations: ['book', 'borrower'],
        skip,
        take: limit,
        order: {
            dueDate: 'ASC'
        }
    });
    return [books, total];
};

export const getBorrowingReport = async (startDate: Date, endDate: Date) => {
    const borrowedBooks = await borrowingRepository.find({
        where: {
            borrowedAt: Between(startDate, endDate),
        },
        relations: ['borrower', 'book']
    });

    return borrowedBooks;
};

export const exportBorrowingReportXlsx = async (data: BorrowedBook[]) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Borrowing Report');

    worksheet.columns = [
        { header: 'Borrower', key: 'borrower', width: 25 },
        { header: 'Book', key: 'book', width: 25 },
        { header: 'Status', key: 'status', width: 15 },
        { header: 'BorrowedAt', key: 'borrowedAt', width: 25 },
        { header: 'DueDate', key: 'dueDate', width: 25 },
        { header: 'ReturnedAt', key: 'returnedAt', width: 25 },
    ];

    data.forEach(item => {
        worksheet.addRow({
            borrower: item.borrower.id,
            book: item.book.id,
            status: item.status,
            borrowedAt: item.borrowedAt.toISOString(),
            dueDate: item.dueDate.toISOString(),
            returnedAt: item.returnedAt ? item.returnedAt.toISOString() : ''
        });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    return buffer;
};

export const getOverdueBorrowsLastMonth = async () => {
    const overdueBorrows = await borrowingRepository.find({
        where: {
            dueDate: LessThan(timeNow),
            returnedAt: IsNull(),
            borrowedAt: Between(lastMonthStart, lastMonthEnd)
        },
        relations: ['borrower', 'book']
    });

    return await exportBorrowingReportXlsx(overdueBorrows);

};

export const getAllBorrowsLastMonth = async () => {
    const AllBorrows = await borrowingRepository.find({
        where: {
            borrowedAt: Between(lastMonthStart, lastMonthEnd),
        },
        relations: ['borrower', 'book'],
    });
    return await exportBorrowingReportXlsx(AllBorrows);

};