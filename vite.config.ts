import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: "index.html",
        books: "books.html",
        currency: "currency.html",
        weather: "weather.html",
      },
    },
  },
  base: "/weblab3/",
});
