import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import MovieCard from "../components/MovieCard";
import Pagination from "../components/Pagination";
import CelebCard from "../components/CelebCard"; // import the new component
import "../styles/pages/Search.css";

export default function Search() {
  // TMDB API Key
  const API_KEY = "dcb6a2332e848860ad8bc86b5ece16bb";

  // Get URL parameters
  const location = useLocation(); // current URL location
  const navigate = useNavigate(); // programmatic navigation
  const searchParams = new URLSearchParams(location.search);

  // Extract query, category, page from URL (with defaults)
  const query = searchParams.get("query") || "";
  const category = searchParams.get("category") || "all";
  const page = parseInt(searchParams.get("page")) || 1;

  // State to store search results
  const [results, setResults] = useState([]); // array of movies or celebs
  const [loading, setLoading] = useState(false); // loading indicator
  const [error, setError] = useState(null); // error message
  const [totalResults, setTotalResults] = useState(0); // total number of results

  // State for genre list (used when searching by genre)
  const [genreList, setGenreList] = useState([]);

  // State for sort option (NEW)
  const [sortBy, setSortBy] = useState("popularity.desc"); // default sort

  // Number of results per page (TMDB default is 20)
  const RESULTS_PER_PAGE = 20;

  // Helper function: given genre ID, return genre name
  const getGenreNameById = (id) => {
    const match = genreList.find((g) => g.id === parseInt(id));
    return match ? match.name : id;
  };

  // Effect 1: fetch genre list if category is "genres"
  useEffect(() => {
    if (category === "genres") {
      // Call TMDB API to get list of genres
      fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}`)
        .then((res) => res.json())
        .then((data) => {
          // Save genre list into state
          setGenreList(data.genres);
        })
        .catch((err) => {
          console.error("Failed to fetch genre list", err);
        });
    }
  }, [category]);

  // Effect 2: fetch search results when query / category / page / sortBy change
  useEffect(() => {
    // If query is empty (for "titles" or "celebs"), do not search
    if (!query.trim() && category !== "genres") return;

    // Set loading state
    setLoading(true);
    setError(null);

    // Async function to fetch data
    const fetchData = async () => {
      try {
        let url = "";

        // Determine API endpoint based on category
        if (category === "titles" || category === "all") {
          // Search movies by title
          url = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${query}&page=${page}`;
        } else if (category === "celebs") {
          // Search people (actors/celebs)
          url = `https://api.themoviedb.org/3/search/person?api_key=${API_KEY}&query=${query}&page=${page}`;
        } else if (category === "genres") {
          // Discover movies by genre (with sort option)
          url = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${query}&page=${page}&sort_by=${sortBy}`;
        }

        // Fetch data from API
        const res = await fetch(url);
        const data = await res.json();

        // Save results and total result count
        setResults(data.results);
        setTotalResults(data.total_results || 0);
      } catch (err) {
        console.error("Search failed", err);
        setError("Something went wrong.");
      } finally {
        // Done loading
        setLoading(false);
      }
    };

    // Run fetchData
    fetchData();
  }, [query, category, page, sortBy]);

  // Calculate total pages
  const totalPages = Math.ceil(totalResults / RESULTS_PER_PAGE);

  // Pagination handler - update URL with new page param
  const handlePageChange = (newPage) => {
    navigate(`/search?query=${query}&category=${category}&page=${newPage}`);
  };

  // Render component
  return (
    <div className="search-container">
      {/* Header: show total results */}
      <h2 className="search-header">
        {totalResults.toLocaleString()} Results for "{category === "genres" ? getGenreNameById(query) : query}"
      </h2>

      {/* Show sort buttons when searching by genre */}
      {category === "genres" && (
        <div className="sort-buttons">
          <button className={sortBy === "popularity.desc" ? "active" : ""} onClick={() => setSortBy("popularity.desc")}>
            Sort by Popularity
          </button>
          <button className={sortBy === "vote_average.desc" ? "active" : ""} onClick={() => setSortBy("vote_average.desc")}>
            Sort by Rating
          </button>
          <button className={sortBy === "release_date.desc" ? "active" : ""} onClick={() => setSortBy("release_date.desc")}>
            Sort by Release Date
          </button>
        </div>
      )}

      {/* Show loading state */}
      {loading && <p>Loading...</p>}

      {/* Show error state */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* No results */}
      {results.length === 0 && !loading && <p>No results found.</p>}

      {/* Display results */}
      <div className="search-results">
        {
          category === "celebs" ?
            // Render celeb cards using CelebCard component
            results.map((person) => <CelebCard key={person.id} person={person} />)
            // Render movie cards using reusable MovieCard component
          : results.map((movie) => <MovieCard key={movie.id} movie={movie} />)
        }
      </div>

      {/* Pagination */}
      <div className="search-pagination">{totalPages > 1 && <Pagination currentPage={page} totalPages={totalPages} onPageChange={handlePageChange} />}</div>
    </div>
  );
}
