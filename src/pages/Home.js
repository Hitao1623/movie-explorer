import { useEffect, useState } from "react";
import MovieCard from "../components/MovieCard";
import { useLocation } from "react-router-dom";

export default function Home() {
  const [movies, setMovies] = useState([]);
  const API_KEY = "dcb6a2332e848860ad8bc86b5ece16bb";

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchTerm = searchParams.get("query") || "";

  useEffect(() => {
    const endpoint =
      searchTerm.trim() ?
        `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${searchTerm}`
      : `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}`;

    fetch(endpoint)
      .then((res) => res.json())
      .then((data) => setMovies(data.results))
      .catch((err) => console.error("Failed to fetch movies", err));
  }, [searchTerm]);

  return (
    <div style={{ marginTop: "10px", marginLeft: "40px", paddingBottom: "60px" }}>
      <h2>Popular Movies</h2>
      <div style={{ display: "flex", flexWrap: "wrap" }}>{Array.isArray(movies) && movies.map((movie) => <MovieCard key={movie.id} movie={movie} />)}</div>
    </div>
  );
}
