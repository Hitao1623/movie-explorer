import { Link, useNavigate } from "react-router-dom";
import "../styles/components/Navbar.css";
import { useEffect, useState } from "react";

// Define Navbar component
export default function Navbar() {
  // State for search query input
  const [query, setQuery] = useState("");

  // State for search category (titles, celebs, genres)
  const [category, setCategory] = useState("all");

  // State to store fetched genre list
  const [genres, setGenres] = useState([]);

  // Hook to enable navigation programmatically
  const navigate = useNavigate();

  // TMDB API key
  const API_KEY = "dcb6a2332e848860ad8bc86b5ece16bb";

  // Effect: when category is "genres", fetch genre list from TMDB API
  useEffect(() => {
    if (category === "genres") {
      fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}`)
        .then((res) => res.json())
        .then((data) => setGenres(data.genres))
        .catch((err) => console.error("Failed to load genres", err));
    }
  }, [category]);

  // Handler for search form submission
  const handleSearchSubmit = (e) => {
    e.preventDefault(); // prevent form reload

    // If query is not empty, navigate to search page with query & category
    if (query.trim()) {
      navigate(`/search?query=${query}&category=${category}`);
    }
  };

  // Render Navbar
  return (
    <nav className="navbar">
      {/* Left: Logo */}
      <div className="navbar-left">
        <Link to="/" className="logo">
          Movie Explorer
        </Link>
      </div>

      {/* Center: Search box */}
      <div className="navbar-center">
        <form onSubmit={handleSearchSubmit} className="search-box">
          {/* Category dropdown */}
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setQuery(""); // Reset query on category change
            }}
            className="search-select">
            <option value="titles">Titles</option>
            <option value="celebs">Celebs</option>
            <option value="genres">Genres</option>
          </select>

          {/* Query input field (either text or dropdown) */}
          {category === "genres" ?
            <select value={query} onChange={(e) => setQuery(e.target.value)} className="search-input">
              <option value="">Select Genre</option>
              {genres.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
          : <input type="text" placeholder="Search Movies" value={query} onChange={(e) => setQuery(e.target.value)} className="search-input" />}

          {/* Submit button */}
          <button type="submit" className="search-button">
            🔍
          </button>
        </form>
      </div>

      {/* Right: Register/Login/Favorites links */}
      <div className="navbar-right">
        <Link to="/register">Register</Link>
        <Link to="/login">Login</Link>
        <Link to="/favorites">Favorites</Link>
      </div>
    </nav>
  );
}
