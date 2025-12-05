import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { CurrencyEntry } from "../types";

interface FrankfurterResponse {
  amount: number;
  base: string;
  date: string;
  rates: Record<string, number>;
}

const CurrencyPage: React.FC = () => {
  const [currencies, setCurrencies] = useState<CurrencyEntry[]>([]);
  const [fromCurrency, setFromCurrency] = useState<string>("USD");
  const [toCurrency, setToCurrency] = useState<string>("EUR");
  const [amount, setAmount] = useState<string>("100");
  const [result, setResult] = useState<string>("");
  const [status, setStatus] = useState<string>(
    "Введите сумму, выберите валюты и нажмите «Конвертировать»."
  );
  const [isError, setIsError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    let ignore = false;

    const loadCurrencies = async () => {
      try {
        setStatus("Загружаю список валют...");
        setIsError(false);
        const resp = await fetch("https://api.frankfurter.app/currencies");
        if (!resp.ok) {
          throw new Error("Не удалось получить список валют.");
        }
        const data: Record<string, string> = await resp.json();
        const entries: CurrencyEntry[] = Object.entries(data)
          .map(([code, name]) => ({ code, name }))
          .sort((a, b) => a.code.localeCompare(b.code));

        if (!ignore) {
          setCurrencies(entries);
          setStatus(
            "Введите сумму, выберите валюты и нажмите «Конвертировать»."
          );
        }
      } catch (error: any) {
        console.error(error);
        if (!ignore) {
          setIsError(true);
          setStatus(error?.message || "Ошибка загрузки списка валют.");
        }
      }
    };

    loadCurrencies();
    return () => {
      ignore = true;
    };
  }, []);

  const handleAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
  };

  const handleFromChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setFromCurrency(e.target.value);
  };

  const handleToChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setToCurrency(e.target.value);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const numericAmount = Number(amount.replace(",", "."));
    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      setIsError(true);
      setStatus("Введите корректную положительную сумму.");
      setResult("");
      return;
    }

    if (!fromCurrency || !toCurrency) {
      setIsError(true);
      setStatus("Выберите валюты.");
      setResult("");
      return;
    }

    if (fromCurrency === toCurrency) {
      setIsError(false);
      setStatus("Исходная и целевая валюта совпадают.");
      setResult(`${numericAmount.toFixed(2)} ${fromCurrency}`);
      return;
    }

    try {
      setIsLoading(true);
      setIsError(false);
      setStatus(
        `Конвертирую ${numericAmount.toFixed(2)} ${fromCurrency} → ${toCurrency}...`
      );
      setResult("");

      const resp = await fetch(
        `https://api.frankfurter.app/latest?amount=${numericAmount}&from=${fromCurrency}&to=${toCurrency}`
      );
      if (!resp.ok) {
        throw new Error("Ошибка ответа Frankfurter API.");
      }
      const data: FrankfurterResponse = await resp.json();
      const rate = data.rates[toCurrency];
      if (rate === undefined) {
        throw new Error("Не удалось получить курс для выбранной валюты.");
      }

      const formatted = `${data.amount.toFixed(2)} ${data.base} = ${rate.toFixed(
        2
      )} ${toCurrency} (курс от ${data.date})`;
      setResult(formatted);
      setStatus("Готово.");
    } catch (error: any) {
      console.error(error);
      setIsError(true);
      setStatus(error?.message || "Ошибка при конвертации.");
      setResult("");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page">
      <header className="page-header">
        <h1>💱 Конвертер валют</h1>
        <p className="muted">
          Источник данных —{" "}
          <a href="https://www.frankfurter.app/" target="_blank" rel="noreferrer">
            Frankfurter API
          </a>
          .
        </p>
      </header>

      <section className="card">
        <form className="form grid-form" onSubmit={handleSubmit}>
          <label className="form-field">
            Сумма
            <input
              type="number"
              min="0"
              step="0.01"
              value={amount}
              onChange={handleAmountChange}
            />
          </label>

          <label className="form-field">
            Из валюты
            <select value={fromCurrency} onChange={handleFromChange}>
              {currencies.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code} — {c.name}
                </option>
              ))}
            </select>
          </label>

          <label className="form-field">
            В валюту
            <select value={toCurrency} onChange={handleToChange}>
              {currencies.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code} — {c.name}
                </option>
              ))}
            </select>
          </label>

          <button
            type="submit"
            className="form-submit"
            disabled={isLoading || currencies.length === 0}
          >
            {isLoading ? "Конвертирую..." : "Конвертировать"}
          </button>
        </form>

        <div className={`status ${isError ? "status--error" : "status--info"}`}>
          {status}
        </div>

        <div className="result">
          {result && (
            <p>
              <strong>{result}</strong>
            </p>
          )}
        </div>
      </section>
    </div>
  );
};

export default CurrencyPage;
