import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import FavoriteButton from "../components/FavoriteButton";
import "../styles/pages/MovieDetail.css";

export default function MovieDetail() {
  const { id } = useParams(); // Get the movie ID from the URL
  const navigate = useNavigate(); // Hook for navigation

  // State variables
  const [movie, setMovie] = useState(null);
  const [director, setDirector] = useState(null);
  const [cast, setCast] = useState([]);
  const [trailerUrl, setTrailerUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_KEY = "dcb6a2332e848860ad8bc86b5ece16bb";

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        // Fetch basic movie data
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}`
        );
        if (!res.ok) throw new Error("Movie not found.");
        const data = await res.json();
        setMovie(data);

        // Fetch credits (cast and crew)
        const creditsRes = await fetch(
          `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${API_KEY}`
        );
        const creditsData = await creditsRes.json();
        setCast(creditsData.cast.slice(0, 20)); // Limit to 20 actors

        // Find director in crew list
        const directorData = creditsData.crew.find(
          (member) => member.job === "Director"
        );
        setDirector(directorData || null);

        // Fetch trailer video (YouTube)
        const videoRes = await fetch(
          `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${API_KEY}`
        );
        const videoData = await videoRes.json();
        const trailer = videoData.results.find(
          (v) => v.type === "Trailer" && v.site === "YouTube"
        );
        if (trailer) {
          setTrailerUrl(`https://www.youtube.com/embed/${trailer.key}`);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load movie.");
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

  // Handle loading and error states
  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!movie) return null;

  // Destructure movie properties
  const {
    title,
    poster_path,
    release_date = "-",
    genres,
    overview,
    runtime,
    vote_average,
    tagline,
  } = movie;

  // Use poster image or fallback
  const imageUrl = poster_path
    ? `https://image.tmdb.org/t/p/w500${poster_path}`
    : "/default-poster.jpg";

  return (
    <div className="movie-detail-container">
      {/* Back button */}
      <button className="movie-detail-back" onClick={() => navigate(-1)}>
        ← Back
      </button>

      {/* Title and tagline */}
      <h2 className="movie-detail-title">{title}</h2>
      {tagline && <p className="movie-detail-tagline">{tagline}</p>}

      {/* Poster and Trailer */}
      <div className="movie-detail-media">
        <div className="movie-detail-poster-wrapper">
          <img
            src={imageUrl}
            alt={`Poster for ${title}`}
            className="movie-detail-poster"
          />
          <div className="favorite-button-wrapper">
            <FavoriteButton movie={movie} />
          </div>
        </div>

        {/* Embedded YouTube trailer */}
        {trailerUrl && (
          <iframe
            className="movie-detail-trailer"
            src={trailerUrl}
            title={`Trailer for ${title}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        )}
      </div>

      {/* Movie metadata */}
      <div className="movie-detail-info">
        <p><strong>Release Date:</strong> {release_date}</p>
        <p><strong>Runtime:</strong> {runtime ? `${runtime} mins` : "N/A"}</p>
        <p><strong>Rating:</strong> {vote_average ? vote_average.toFixed(1) : "N/A"}</p>
        <p><strong>Genres:</strong> {genres?.map((g) => g.name).join(", ") || "N/A"}</p>
        <br />
        <p className="movie-detail-overview">{overview}</p>

        {/* Director Info Section */}
        {director && (
          <div className="movie-detail-director">
            <h3>Director</h3>
            <Link to={`/person/${director.id}`} className="movie-detail-cast-card">
              {director.profile_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w185${director.profile_path}`}
                  alt={director.name}
                />
              ) : (
                <div className="movie-detail-director-placeholder" />
              )}
              <p>{director.name}</p>
            </Link>
          </div>
        )}
      </div>

      {/* Cast list */}
      <h3 className="movie-detail-cast-heading">Cast</h3>
      <div className="movie-detail-cast-scroll">
        {cast
          .filter((actor) => actor.profile_path) // Only show actors with profile images
          .map((actor) => (
            <Link
              to={`/person/${actor.id}`}
              key={actor.id}
              className="movie-detail-cast-card"
            >
              <img
                src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
                alt={actor.name}
              />
              <p>{actor.name}</p>
            </Link>
          ))}
      </div>
    </div>
  );
}
