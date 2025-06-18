import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";

export default function Navbar() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [genres, setGenres] = useState([]);
  const navigate = useNavigate();
  const API_KEY = "dcb6a2332e848860ad8bc86b5ece16bb";

  const { user, logout } = useAuth();

  useEffect(() => {
    if (category === "genres") {
      fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}`)
        .then((res) => res.json())
        .then((data) => setGenres(data.genres))
        .catch((err) => console.error("Failed to load genres", err));
    }
  }, [category]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?query=${query}&category=${category}`);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="logo">
          Movie Explorer
        </Link>
      </div>

      <div className="navbar-center">
        <form onSubmit={handleSearchSubmit} className="search-box">
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setQuery("");
            }}
            className="search-select">
            <option value="titles">Titles</option>
            <option value="celebs">Celebs</option>
            <option value="genres">Genres</option>
          </select>

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

          <button type="submit" className="search-button">
            🔍
          </button>
        </form>
      </div>

      <div className="navbar-right">
        {/* <Link to="/register">Register</Link>
        <Link to="/login">Login</Link>
        <Link to="/favorites">Favorites</Link> */}
        <Link to="/favorites">Favorites</Link>

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
      </div>
    </nav>
  );
}
