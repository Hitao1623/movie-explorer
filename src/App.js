import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { FavoritesProvider } from "./context/FavoritesContext";
import Home from "./pages/Home";
import Search from "./pages/Search";
import MovieDetail from "./pages/MovieDetail";
import Favorites from "./pages/Favorites";
import Navbar from "./components/Navbar";
import Register from "./pages/Register";
import Login from "./pages/Login";

export default function App() {
  return (
  
    <Router>
      <FavoritesProvider>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movie/:id" element={<MovieDetail />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/register" element={<Register />} />
        <Route path="/search" element={<Search />} />
        <Route path="/login" element={<Login />} />
      </Routes>
      </FavoritesProvider>
    </Router>
  
  );
}
