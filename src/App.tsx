import NavBar from "./components/NavBar";
import HomePage from "./pages/HomePage";
import BooksPage from "./pages/BooksPage";
import CurrencyPage from "./pages/CurrencyPage";
import WeatherPage from "./pages/WeatherPage";

export type PageId = "home" | "books" | "currency" | "weather";

interface AppProps {
  page: PageId;
}

const App: React.FC<AppProps> = ({ page }) => {
  let content: JSX.Element;

  switch (page) {
    case "books":
      content = <BooksPage />;
      break;
    case "currency":
      content = <CurrencyPage />;
      break;
    case "weather":
      content = <WeatherPage />;
      break;
    case "home":
    default:
      content = <HomePage />;
  }

  return (
    <div className="app">
      <NavBar current={page} />
      <main className="app__main">
        <div className="container">{content}</div>
      </main>
    </div>
  );
};

export default App;
