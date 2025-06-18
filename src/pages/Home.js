import { useEffect, useState } from "react";
import MovieCard from "../components/MovieCard";
import { useLocation } from "react-router-dom";
import "../styles/Home.css";

export default function Home() {
  // State: store "Now Playing" movies (array of movie objects)
  const [nowPlaying, setNowPlaying] = useState([]);

  // State: store "Popular Movies" (array of movie objects)
  const [popularMovies, setPopularMovies] = useState([]);

  // State: store { movieId: youtube trailer url } map
  const [trailers, setTrailers] = useState({});

  // State: index of currently selected movie in Now Playing list
  const [currentIndex, setCurrentIndex] = useState(0);

  // State: list of movie ids which are currently playing (used to toggle iframe)
  const [playingVideoIds, setPlayingVideoIds] = useState([]);

  // TMDB API key
  const API_KEY = "dcb6a2332e848860ad8bc86b5ece16bb";

  // Get current search query from URL params
  const location = useLocation();
  const searchTerm = new URLSearchParams(location.search).get("query") || "";

  // Fetch "Now Playing" movies and their trailers (runs on page load)
  useEffect(() => {
    fetch(`https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}`)
      .then((res) => res.json())
      .then(async (data) => {
        const movies = data.results.slice(0, 10); // Only take top 10 movies
        setNowPlaying(movies);

        // For each movie, fetch its trailer link
        const trailerData = {};
        await Promise.all(
          movies.map(async (movie) => {
            const res = await fetch(`https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=${API_KEY}`);
            const videoData = await res.json();
            // Find Youtube "Trailer" type video
            const trailer = videoData.results.find((v) => v.type === "Trailer" && v.site === "YouTube");
            if (trailer) trailerData[movie.id] = `https://www.youtube.com/embed/${trailer.key}`;
          })
        );

        // Save trailers map into state
        setTrailers(trailerData);
      });
  }, []);

  // Fetch "Popular Movies" or search results when searchTerm changes
  useEffect(() => {
    const url =
      searchTerm.trim() ?
        `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${searchTerm}`
      : `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => setPopularMovies(data.results.slice(0, 20))); // Top 20 popular movies
  }, [searchTerm]);

  // Handler: when user clicks Play on a movie -> mark this movieId as playing
  const handlePlay = (id) => setPlayingVideoIds((prev) => [...prev, id]);

  // Handler: go to previous movie in carousel (circular)
  const prevSlide = () => setCurrentIndex((prev) => (prev === 0 ? nowPlaying.length - 1 : prev - 1));

  // Handler: go to next movie in carousel (circular)
  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % nowPlaying.length);

  return (
    <div className="home-container">
      {/* Section 1: NOW SHOWING carousel */}
      <section>
        <h2 className="now-showing-header">Now Showing</h2>

        {/* Only render when data is ready */}
        {nowPlaying.length > 0 && (
          <div className="video-section">
            {/* Center Main Video */}
            <div className="main-video-container">
              {
                // If this movie was played -> show iframe (Youtube player)
                trailers[nowPlaying[currentIndex].id] && playingVideoIds.includes(nowPlaying[currentIndex].id) ?
                  <iframe
                    className="main-video"
                    src={trailers[nowPlaying[currentIndex].id]}
                    title={nowPlaying[currentIndex].title}
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                  />
                  // Else show image fallback + Play button
                : <div style={{ position: "relative" }}>
                    <img
                      src={`https://image.tmdb.org/t/p/w780${nowPlaying[currentIndex].backdrop_path || nowPlaying[currentIndex].poster_path}`}
                      alt={nowPlaying[currentIndex].title}
                      className="main-video-fallback"
                    />
                    <button className="play-button" onClick={() => handlePlay(nowPlaying[currentIndex].id)}>
                      ▶
                    </button>
                  </div>

              }

              {/* Navigation Arrows */}
              <button onClick={prevSlide} className="nav-btn left">
                &#10094;
              </button>
              <button onClick={nextSlide} className="nav-btn right">
                &#10095;
              </button>

              {/* Movie Rating */}
              <div className="score-badge">
                <span style={{ color: "#f5c518", marginRight: "4px" }}>★</span>
                {(nowPlaying[currentIndex].vote_average || 0).toFixed(1)}
              </div>

              {/* Movie Title and Release Date */}
              <div className="video-title">{nowPlaying[currentIndex].title}</div>
              <div className="video-date">{nowPlaying[currentIndex].release_date}</div>
            </div>

            {/* Right side - 3 preview thumbnails */}
            <div className="side-thumbnails">
              {[1, 2, 3].map((offset) => {
                const index = (currentIndex + offset) % nowPlaying.length;
                const movie = nowPlaying[index];
                return (
                  <div className="side-thumb-wrapper" key={movie.id}>
                    <img src={`https://image.tmdb.org/t/p/w300${movie.backdrop_path || movie.poster_path}`} alt={movie.title} className="side-thumb" />
                    <button className="thumb-play-button" onClick={() => handlePlay(movie.id)}>
                      ▶
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </section>

      {/* Section 2: POPULAR MOVIES horizontal scroll */}
      <section className="popular-section">
        <h2 className="popular-header">Popular Movies</h2>

        <div className="popular-scroll">
          {popularMovies.map((movie) => (
            <div key={movie.id} style={{ minWidth: "160px" }}>
              {/* Reuse MovieCard component */}
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
