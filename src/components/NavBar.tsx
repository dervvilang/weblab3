import { PageId } from "../App";

interface NavBarProps {
  current: PageId;
}

const NavBar: React.FC<NavBarProps> = ({ current }) => {
  const linkClass = (id: PageId) =>
    "nav__link" + (current === id ? " nav__link--active" : "");

  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <div className="site-header__brand">WebLab3</div>
        <nav className="nav">
          <a href="./" className={linkClass("home")}>
            Главная
          </a>
          <a href="books.html" className={linkClass("books")}>
            Поиск книг
          </a>
          <a href="currency.html" className={linkClass("currency")}>
            Конвертер валют
          </a>
          <a href="weather.html" className={linkClass("weather")}>
            Погода
          </a>
        </nav>
      </div>
    </header>
  );
};

export default NavBar;
