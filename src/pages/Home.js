import { useEffect, useState } from "react";
import MovieCard from "../components/MovieCard";
import { useLocation } from "react-router-dom";

export default function Home() {
  const [nowPlaying, setNowPlaying] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [trailers, setTrailers] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const API_KEY = "dcb6a2332e848860ad8bc86b5ece16bb";

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchTerm = searchParams.get("query") || "";

  // Load now playing movies and trailers
  useEffect(() => {
    fetch(`https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}`)
      .then((res) => res.json())
      .then(async (data) => {
        const movies = data.results.slice(0, 10);
        const visibleMovies = movies.slice(0, 4);
        setNowPlaying(movies);

        const trailerData = {};
        await Promise.all(
          visibleMovies.map(async (movie) => {
            const res = await fetch(`https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=${API_KEY}`);
            const videoData = await res.json();
            const trailer = videoData.results.find((v) => v.type === "Trailer" && v.site === "YouTube");
            if (trailer) {
              trailerData[movie.id] = `https://www.youtube.com/embed/${trailer.key}`;
            }
          })
        );
        setTrailers(trailerData);
      });
  }, []);

  // Load popular movies
  useEffect(() => {
    const endpoint =
      searchTerm.trim() ?
        `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${searchTerm}`
      : `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}`;

    fetch(endpoint)
      .then((res) => res.json())
      .then((data) => setPopularMovies(data.results.slice(0, 20)))
      .catch((err) => console.error("Failed to fetch movies", err));
  }, [searchTerm]);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? nowPlaying.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === nowPlaying.length - 1 ? 0 : prev + 1));
  };

  return (
    <div style={{ marginTop: "10px", padding: "0 40px 60px" }}>
      <section>
        <h2 style={{ marginLeft: "150px", marginBottom: "30px" }}>Now Showing</h2>
        {nowPlaying.length > 0 && (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-start", gap: "20px" }}>
            {/* Center Video */}
            <div style={{ position: "relative", width: "760px", height: "460px" }}>
              {trailers[nowPlaying[currentIndex].id] ?
                <iframe
                  width="760"
                  height="460"
                  src={trailers[nowPlaying[currentIndex].id]}
                  title={nowPlaying[currentIndex].title}
                  frameBorder="0"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                  style={{ borderRadius: "8px" }}
                />
              : <img
                  src={`https://image.tmdb.org/t/p/w640${nowPlaying[currentIndex].backdrop_path}`}
                  alt={nowPlaying[currentIndex].title}
                  style={{ width: "760px", height: "460px", objectFit: "cover", borderRadius: "8px" }}
                />
              }

              {/* Slide Buttons */}
              <button onClick={prevSlide} style={navBtnStyle("left")}>
                &#10094;
              </button>
              <button onClick={nextSlide} style={navBtnStyle("right")}>
                &#10095;
              </button>

              {/* Score badge — now inside relative box */}
              <div
                style={{
                  position: "absolute",
                  bottom: "10px",
                  right: "10px",
                  backgroundColor: "white",
                  borderRadius: "20px",
                  padding: "4px 8px",
                  fontWeight: "bold",
                  fontSize: "14px",
                  display: "flex",
                  alignItems: "center",
                  boxShadow: "0 2px 6px rgba(0, 0, 0, 0.2)",
                }}>
                <span style={{ color: "#f5c518", marginRight: "4px" }}>★</span>
                {(nowPlaying[currentIndex].vote_average || 0).toFixed(1)}
              </div>

              {/* Title & Release Date */}
              <div style={{ textAlign: "center", marginTop: "16px" }}>
                <div style={{ fontWeight: "bold" }}>{nowPlaying[currentIndex].title}</div>
                <div style={{ color: "#555", marginTop: "6px" }}>{nowPlaying[currentIndex].release_date}</div>
              </div>
            </div>

            {/* Side Thumbnails */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {nowPlaying
                .filter((_, i) => i !== currentIndex)
                .slice(currentIndex + 1, currentIndex + 4)
                .concat(nowPlaying.slice(0, Math.max(0, 3 - (nowPlaying.length - currentIndex - 1))))
                .map((movie) => (
                  <iframe
                    key={movie.id}
                    width="240"
                    height="144"
                    src={trailers[movie.id]}
                    title={movie.title}
                    frameBorder="0"
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                    style={{ borderRadius: "6px" }}
                  />
                ))}
            </div>
          </div>
        )}
      </section>

      <section>
        <h2 style={{ marginTop: "60px", marginLeft: "150px" }}>Popular Movies</h2>
        <div style={{ display: "flex", overflowX: "auto", gap: "56px", marginTop: "10px", marginLeft: "140px", marginRight: "140px" }}>
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

function navBtnStyle(position) {
  return {
    position: "absolute",
    top: "50%",
    [position]: "10px",
    transform: "translateY(-50%)",
    backgroundColor: "rgba(0,0,0,0.5)",
    color: "white",
    border: "none",
    borderRadius: "50%",
    width: "50px",
    height: "50px",
    fontSize: "20px",
    cursor: "pointer",
    zIndex: 10,
  };
}
