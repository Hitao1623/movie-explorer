import { useEffect, useState } from "react";
import MovieCard from "../components/MovieCard";
import { useLocation } from "react-router-dom";
import "../styles/Home.css";

export default function Home() {
  // State to store now playing movies
  const [nowPlaying, setNowPlaying] = useState([]);

  // State to store popular movies
  const [popularMovies, setPopularMovies] = useState([]);

  // State to store trailer video URLs mapped by movie ID
  const [trailers, setTrailers] = useState({});

  // Index of the currently focused movie in nowPlaying
  const [currentIndex, setCurrentIndex] = useState(0);

  // Store IDs of movies that have been triggered for playback
  const [playingVideoIds, setPlayingVideoIds] = useState([]);

  // TMDB API key
  const API_KEY = "dcb6a2332e848860ad8bc86b5ece16bb";

  // Get current search query from URL
  const location = useLocation();
  const searchTerm = new URLSearchParams(location.search).get("query") || "";

  // Fetch now playing movies and their trailers
  useEffect(() => {
    fetch(`https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}`)
      .then((res) => res.json())
      .then(async (data) => {
        const movies = data.results.slice(0, 10);
        setNowPlaying(movies);

        const trailerData = {};
        await Promise.all(
          movies.map(async (movie) => {
            const res = await fetch(`https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=${API_KEY}`);
            const videoData = await res.json();
            const trailer = videoData.results.find((v) => v.type === "Trailer" && v.site === "YouTube");
            if (trailer) trailerData[movie.id] = `https://www.youtube.com/embed/${trailer.key}`;
          })
        );

        setTrailers(trailerData);
      });
  }, []);

  // Fetch popular movies or search results depending on search term
  useEffect(() => {
    const url =
      searchTerm.trim() ?
        `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${searchTerm}`
      : `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => setPopularMovies(data.results.slice(0, 20)));
  }, [searchTerm]);

  // Play button triggers loading iframe for a specific movie ID
  const handlePlay = (id) => setPlayingVideoIds((prev) => [...prev, id]);

  // Go to previous movie (loop around)
  const prevSlide = () => setCurrentIndex((prev) => (prev === 0 ? nowPlaying.length - 1 : prev - 1));

  // Go to next movie (loop around)
  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % nowPlaying.length);

  return (
    <div className="home-container">
      {/* Now Showing Section */}
      <section>
        <h2 className="now-showing-header">Now Showing</h2>

        {nowPlaying.length > 0 && (
          <div className="video-section">
            {/* Main (center) video */}
            <div className="main-video-container">
              {trailers[nowPlaying[currentIndex].id] && playingVideoIds.includes(nowPlaying[currentIndex].id) ?
                <iframe
                  className="main-video"
                  src={trailers[nowPlaying[currentIndex].id]}
                  title={nowPlaying[currentIndex].title}
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                />
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

              {/* Navigation buttons */}
              <button onClick={prevSlide} className="nav-btn left">
                &#10094;
              </button>
              <button onClick={nextSlide} className="nav-btn right">
                &#10095;
              </button>

              {/* Score */}
              <div className="score-badge">
                <span style={{ color: "#f5c518", marginRight: "4px" }}>★</span>
                {(nowPlaying[currentIndex].vote_average || 0).toFixed(1)}
              </div>

              {/* Title & Release Date */}
              <div className="video-title">{nowPlaying[currentIndex].title}</div>
              <div className="video-date">{nowPlaying[currentIndex].release_date}</div>
            </div>

            {/* Right-side thumbnails (3 previews) */}
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

      {/* Popular Movies Section */}
      <section className="popular-section">
        <h2 className="popular-header">Popular Movies</h2>
        <div className="popular-scroll">
          {popularMovies.map((movie) => (
            <div key={movie.id} style={{ minWidth: "160px" }}>
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
