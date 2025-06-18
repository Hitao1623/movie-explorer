import { Link, useNavigate } from "react-router-dom";
import "../styles/components/Navbar.css";
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";

// Define Navbar component
export default function Navbar() {
  // State: holds the user-typed search query string
  const [query, setQuery] = useState("");

  // State: holds the selected category - can be "titles", "celebs", or "genres"
  const [category, setCategory] = useState("all");

  // State: stores genre list fetched from TMDB (array of { id, name })
  const [genres, setGenres] = useState([]);

  // Hook: used to navigate programmatically to another route (search page)
  const navigate = useNavigate();

  // TMDB API key (used to call genre API)
  const API_KEY = "dcb6a2332e848860ad8bc86b5ece16bb";

  const { user, logout } = useAuth();

  const { user, logout } = useAuth();

  // Effect: when category changes to "genres", fetch the genre list
  useEffect(() => {
    if (category === "genres") {
      // Call TMDB API to get genre list
      fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}`)
        .then((res) => res.json())
        .then((data) => {
          // Save genres to state
          setGenres(data.genres);
        })
        .catch((err) => {
          console.error("Failed to load genres", err);
        });
    }
  }, [category]); // Only runs when "category" changes

  // Handler: triggered when search form is submitted
  const handleSearchSubmit = (e) => {
    e.preventDefault(); // Prevent browser reload on form submit

    // If search query is non-empty
    if (query.trim()) {
      // Navigate to /search page with query & category params in URL
      navigate(`/search?query=${query}&category=${category}`);
    }
  };

  // Render Navbar
  return (
    <nav className="navbar">
      {/* Left Section: Logo */}
      <div className="navbar-left">
        <Link to="/" className="logo">
          Movie Explorer
        </Link>
      </div>

      {/* Center Section: Search Box */}
      <div className="navbar-center">
        <form onSubmit={handleSearchSubmit} className="search-box">
          {/* Dropdown: category select (titles, celebs, genres) */}
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value); // update category state
              setQuery(""); // reset search query when changing category
            }}
            className="search-select">
            <option value="titles">Titles</option>
            <option value="celebs">Celebs</option>
            <option value="genres">Genres</option>
          </select>

          {/* If "genres", render dropdown to select genre */}
          {
            category === "genres" ?
              <select value={query} onChange={(e) => setQuery(e.target.value)} className="search-input">
                <option value="">Select Genre</option>
                {genres.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
              </select>
              // If "titles" or "celebs", render text input field
            : <input type="text" placeholder="Search Movies" value={query} onChange={(e) => setQuery(e.target.value)} className="search-input" />
          }

          {/* Submit button (magnifier icon) */}
          <button type="submit" className="search-button">
            🔍
          </button>
        </form>
      </div>

      {/* Right Section: Navigation Links (Register / Login / Favorites) */}
      <div className="navbar-right">

        {user ? (
          <>
            <span style={{ marginRight: "1rem" }}>Welcome, {user.username}</span>
            <button onClick={() => logout()} style={{ cursor: "pointer" }}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/register">Register</Link>
            <Link to="/login">Login</Link>
          </>
        )}

        <Link to="/favorites">Favorites</Link>
      </div>
    </nav>
  );
}
