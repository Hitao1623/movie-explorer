import { useEffect, useState } from "react";
import MovieCard from "../components/MovieCard";
import { useLocation } from "react-router-dom";
import "../styles/Home.css";

export default function Home() {
  const [nowPlaying, setNowPlaying] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [trailers, setTrailers] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [playingVideoIds, setPlayingVideoIds] = useState([]);
  const API_KEY = "dcb6a2332e848860ad8bc86b5ece16bb";

  const location = useLocation();
  const searchTerm = new URLSearchParams(location.search).get("query") || "";

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

  useEffect(() => {
    const url =
      searchTerm.trim() ?
        `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${searchTerm}`
      : `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}`;
    fetch(url)
      .then((res) => res.json())
      .then((data) => setPopularMovies(data.results.slice(0, 20)));
  }, [searchTerm]);

  const handlePlay = (id) => setPlayingVideoIds((prev) => [...prev, id]);
  const prevSlide = () => setCurrentIndex((prev) => (prev === 0 ? nowPlaying.length - 1 : prev - 1));
  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % nowPlaying.length);

  return (
    <div className="home-container">
      <section>
        <h2 className="now-showing-header">Now Showing</h2>
        {nowPlaying.length > 0 && (
          <div className="video-section">
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
              <button onClick={prevSlide} className="nav-btn left">
                &#10094;
              </button>
              <button onClick={nextSlide} className="nav-btn right">
                &#10095;
              </button>
              <div className="score-badge">
                <span style={{ color: "#f5c518", marginRight: "4px" }}>★</span>
                {(nowPlaying[currentIndex].vote_average || 0).toFixed(1)}
              </div>
              <div className="video-title">{nowPlaying[currentIndex].title}</div>
              <div className="video-date">{nowPlaying[currentIndex].release_date}</div>
            </div>

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
