import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import MovieCard from "../components/MovieCard";
import Pagination from "../components/Pagination";

export default function Search() {
  const API_KEY = "dcb6a2332e848860ad8bc86b5ece16bb";
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get("query") || "";
  const category = searchParams.get("category") || "all";
  const page = parseInt(searchParams.get("page")) || 1;

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalResults, setTotalResults] = useState(0);
  const [genreList, setGenreList] = useState([]);

  const RESULTS_PER_PAGE = 20;

  const getGenreNameById = (id) => {
    const match = genreList.find((g) => g.id === parseInt(id));
    return match ? match.name : id;
  };

  useEffect(() => {
    if (category === "genres") {
      fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}`)
        .then((res) => res.json())
        .then((data) => setGenreList(data.genres));
    }
  }, [category]);

  useEffect(() => {
    if (!query.trim() && category !== "genres") return;

    setLoading(true);
    setError(null);

    const fetchData = async () => {
      try {
        let url = "";

        if (category === "titles" || category === "all") {
          url = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${query}&page=${page}`;
        } else if (category === "celebs") {
          url = `https://api.themoviedb.org/3/search/person?api_key=${API_KEY}&query=${query}&page=${page}`;
        } else if (category === "genres") {
          url = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${query}&page=${page}`;
        }

        const res = await fetch(url);
        const data = await res.json();
        setResults(category === "celebs" ? data.results : data.results);
        setTotalResults(data.total_results || 0);
      } catch (err) {
        console.error("Search failed", err);
        setError("Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [query, category, page]);

  const totalPages = Math.ceil(totalResults / RESULTS_PER_PAGE);

  const handlePageChange = (newPage) => {
    navigate(`/search?query=${query}&category=${category}&page=${newPage}`);
  };

  return (
    <div style={{ marginTop: "10px", marginLeft: "40px", paddingBottom: "60px" }}>
      <h2>
        {totalResults.toLocaleString()} Results for "{category === "genres" ? getGenreNameById(query) : query}"
      </h2>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {results.length === 0 && !loading && <p>No results found.</p>}

      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {category === "celebs" ?
          results.map((person) => (
            <div key={person.id} style={{ margin: "10px", width: "160px", textAlign: "center" }}>
              <img src={`https://image.tmdb.org/t/p/w200${person.profile_path}`} alt={person.name} style={{ width: "100%", borderRadius: "8px" }} />
              <p>{person.name}</p>
            </div>
          ))
        : results.map((movie) => <MovieCard key={movie.id} movie={movie} />)}
      </div>

      <div style={{ marginTop: "30px", textAlign: "center" }}>
        {totalPages > 1 && <Pagination currentPage={page} totalPages={totalPages} onPageChange={handlePageChange} />}
      </div>
    </div>
  );
}
