import { CreateBookDto } from "./dto/create-book.dto";
import { Book } from "./book.entity";
import { UpdateBookDto } from "./dto/update-book.dto";
import { AppDataSource } from "../../config/database";

const bookRepository = AppDataSource.getRepository(Book);

export const createBook = async (dto: CreateBookDto): Promise<Book> => {
    const book = bookRepository.create(dto);
    return await bookRepository.save(book);
};

export const findAllBooks = async (
    search: string,
    page: number = 1,
    limit: number = 10,
): Promise<[Book[], number]> => {
    const data = bookRepository.createQueryBuilder('book');

    if (search) {
        data.where('book.title ILIKE :search', { search: `%${search}%` })
            .orWhere('book.author ILIKE :search', { search: `%${search}%` })
            .orWhere('book.ISBN ILIKE :search', { search: `%${search}%` });
    }
    const skip = (page - 1) * limit;
    data.skip(Number(skip)).take(limit)
    const [books, total] = await data.getManyAndCount();
    return [books, total] as [Book[], number];
}

export const findBookById = async (id: string): Promise<Book> => {
    const book = await bookRepository.findOne({ where: { id } });
    if (!book) throw new Error('Book not found');
    return book;
};

export const updateBook = async (id: string, dto: UpdateBookDto): Promise<Book> => {
    const book = await bookRepository.findOne({ where: { id } });
    if (!book) throw new Error("Book not found");

    bookRepository.merge(book, dto);
    return await bookRepository.save(book);
}

export const deleteBook = async (id: string): Promise<void> => {
    const book = await bookRepository.findOne({ where: { id } });
    if (!book) throw new Error('Book not found');

    await bookRepository.delete({ id });
};