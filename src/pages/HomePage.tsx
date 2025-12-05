const HomePage: React.FC = () => {
  return (
    <div className="page">
      <header className="page-header">
        <h1>🌐 WebLab3</h1>
        <p className="muted">
          Лабораторная работа №3 по веб-программированию на React и TypeScript
          с использованием Vite.
        </p>
      </header>

      <section className="card">
        <h2>Что реализовано</h2>
        <ul className="list">
          <li>
            📚 <strong>Поиск книг</strong> - Open Library API.
          </li>
          <li>
            💱 <strong>Конвертер валют</strong> - Frankfurter API.
          </li>
          <li>
            ☁️ <strong>Погода</strong> - Open-Meteo API.
          </li>
        </ul>
        <p className="muted">
          Используй ссылки в шапке, чтобы перейти к нужному разделу.
        </p>
      </section>
    </div>
  );
};

export default HomePage;
