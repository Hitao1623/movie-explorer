import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Search from "./pages/Search";
import MovieDetail from "./pages/MovieDetail";
import Favorites from "./pages/Favorites";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Register from "./pages/Register";
import Login from "./pages/Login";
import PrivateRoute from "./components/PrivateRoute";
import { AuthProvider } from "./contexts/AuthContext.js";
import { FavoritesProvider } from "./contexts/FavoritesContext.js";
import "./styles/App.css";
import PersonDetail from "./pages/PersonDetail";

export default function App() {
  return (
    // Provide authentication context to entire app
    <AuthProvider>
      {/* Provide favorites context to entire app */}
      <FavoritesProvider>
        {/* Set up React Router */}
        <Router>
          <div className="app-container">
            {/* Global Navbar (always visible) */}
            <Navbar />

            {/* Main page content */}
            <main className="main-content">
              <Routes>
                {/* Home page */}
                <Route path="/" element={<Home />} />

                {/* Search page */}
                <Route path="/search" element={<Search />} />

                {/* Movie detail page */}
                <Route path="/movie/:id" element={<MovieDetail />} />

                {/* Favorites page - protected by PrivateRoute */}
                <Route
                  path="/favorites"
                  element={
                    <PrivateRoute>
                      <Favorites />
                    </PrivateRoute>
                  }
                />

                {/* User registration page */}
                <Route path="/register" element={<Register />} />

                {/* User login page */}
                <Route path="/login" element={<Login />} />

                {/* Actor / person detail page */}
                <Route path="/person/:id" element={<PersonDetail />} />
              </Routes>
            </main>

            {/* Global Footer (always visible) */}
            <Footer />
          </div>
        </Router>
      </FavoritesProvider>
    </AuthProvider>
  );
}
