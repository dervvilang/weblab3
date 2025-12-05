import { ChangeEvent, FormEvent, useState } from "react";
import { BookResult } from "../types";
import BookCard from "../components/BookCard";

const BooksPage: React.FC = () => {
  const [query, setQuery] = useState<string>("");
  const [results, setResults] = useState<BookResult[]>([]);
  const [status, setStatus] = useState<string>(
    "Введите запрос (название книги, автор...) и нажмите «Найти»."
  );
  const [isError, setIsError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleQueryChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) {
      return;
    }

    setIsError(false);
    setIsLoading(true);
    setResults([]);
    setStatus(`Ищу книги по запросу «${trimmed}»...`);

    try {
      const response = await fetch(
        `https://openlibrary.org/search.json?q=${encodeURIComponent(
          trimmed
        )}&limit=20`
      );
      if (!response.ok) {
        throw new Error("Ошибка при запросе к Open Library.");
      }

      const data: any = await response.json();
      const docs: any[] = Array.isArray(data.docs) ? data.docs : [];

      if (docs.length === 0) {
        setStatus("Ничего не найдено.");
        return;
      }

      const mapped: BookResult[] = docs.map((doc: any): BookResult => {
        const title: string = doc.title ?? "Без названия";
        const authors: string = Array.isArray(doc.author_name)
          ? (doc.author_name as string[]).join(", ")
          : "Автор не указан";
        const year: string =
          typeof doc.first_publish_year === "number"
            ? String(doc.first_publish_year)
            : "—";
        const coverId: number | undefined = doc.cover_i;
        const key: string =
          typeof doc.key === "string"
            ? doc.key
            : `${title}-${authors}-${year}`;

        return {
          key,
          title,
          authors,
          year,
          coverUrl: coverId
            ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`
            : null,
          detailsUrl: `https://openlibrary.org${key}`,
        };
      });

      setResults(mapped);
      setStatus(`Найдено результатов: ${mapped.length}.`);
    } catch (error: any) {
      console.error(error);
      setIsError(true);
      setStatus(error?.message || "Произошла ошибка при поиске.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page">
      <header className="page-header">
        <h1>📚 Поиск книг</h1>
        <p className="muted">
          Источник данных —{" "}
          <a href="https://openlibrary.org/" target="_blank" rel="noreferrer">
            Open Library
          </a>
          .
        </p>
      </header>

      <section className="card">
        <form className="form" onSubmit={handleSubmit}>
          <label className="form-field">
            Поисковый запрос
            <input
              type="text"
              value={query}
              onChange={handleQueryChange}
              placeholder="Например, Harry Potter или Dostoevsky"
            />
          </label>
          <button type="submit" disabled={isLoading || !query.trim()}>
            {isLoading ? "Поиск..." : "Найти"}
          </button>
        </form>
        <div className={`status ${isError ? "status--error" : "status--info"}`}>
          {status}
        </div>
      </section>

      <section className="results">
        {results.length === 0 && !isLoading ? (
          <p className="muted">Результаты поиска появятся здесь.</p>
        ) : (
          <div className="grid">
            {results.map((book) => (
              <BookCard key={book.key} book={book} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default BooksPage;
