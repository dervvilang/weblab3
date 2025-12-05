import { BookResult } from "../types";

interface BookCardProps {
  book: BookResult;
}

const BookCard: React.FC<BookCardProps> = ({ book }) => {
  return (
    <article className="card book-card">
      {book.coverUrl && (
        <img
          className="book-card__cover"
          src={book.coverUrl}
          alt={`Обложка книги «${book.title}»`}
        />
      )}
      <div className="book-card__body">
        <h3 className="book-card__title">{book.title}</h3>
        <p className="book-card__meta">
          {book.authors}
          {book.year !== "-" && ` • ${book.year}`}
        </p>
        <a
          className="book-card__link"
          href={book.detailsUrl}
          target="_blank"
          rel="noreferrer"
        >
          Подробнее на Open Library
        </a>
      </div>
    </article>
  );
};

export default BookCard;
