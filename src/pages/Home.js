import { useEffect, useState } from "react";
import MovieCard from "../components/MovieCard";

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [query, setQuery] = useState("");
  const API_KEY = "dcb6a2332e848860ad8bc86b5ece16bb";

  const handleSearchChange = (e) => setQuery(e.target.value);

  useEffect(() => {
    const endpoint =
      query.trim() ?
        `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${query}`
      : `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}`;

    fetch(endpoint)
      .then((res) => res.json())
      .then((data) => setMovies(data.results))
      .catch((err) => console.error("Failed to fetch movies", err));
  }, [query]);

  return (
    <div>
      <h2>Popular Movies</h2>

      <input
        type="text"
        placeholder="Search movies..."
        value={query}
        onChange={handleSearchChange}
        style={{ marginBottom: "20px", padding: "8px", width: "300px" }}
      />

      <div style={{ display: "flex", flexWrap: "wrap" }}>{Array.isArray(movies) && movies.map((movie) => <MovieCard key={movie.id} movie={movie} />)}</div>
    </div>
  );
}
