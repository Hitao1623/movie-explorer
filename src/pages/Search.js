import { useState, useEffect } from "react";
import MovieCard from "../components/MovieCard";

export default function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const API_KEY = "dcb6a2332e848860ad8bc86b5ece16bb";

  const handleChange = (e) => setQuery(e.target.value);

  useEffect(() => {
    if (query.trim() === "") return;
    const timer = setTimeout(() => {
      fetch(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${query}`)
        .then((res) => res.json())
        .then((data) => setResults(data.results))
        .catch((err) => console.error("Search failed", err));
    }, 500);
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div>
      <input type="text" value={query} onChange={handleChange} placeholder="Search movies..." />
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {results.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
}
