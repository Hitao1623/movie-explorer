import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import FavoriteButton from "../components/FavoriteButton";
import { Link } from "react-router-dom";
import "../styles/pages/MovieDetail.css";

export default function MovieDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [cast, setCast] = useState([]);
  const [trailerUrl, setTrailerUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_KEY = "dcb6a2332e848860ad8bc86b5ece16bb";

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        // Fetch main movie data
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}`
        );
        if (!res.ok) throw new Error("Movie not found.");
        const data = await res.json();
        setMovie(data);

        // Fetch cast data (top 20)
        const creditsRes = await fetch(
          `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${API_KEY}`
        );
        const creditsData = await creditsRes.json();
        setCast(creditsData.cast.slice(0, 20));

        // Fetch trailer video 
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

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!movie) return null;

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

  const imageUrl = poster_path
    ? `https://image.tmdb.org/t/p/w500${poster_path}`
    : "/default-poster.jpg";

  return (
    <div className="movie-detail-container">
      <button className="movie-detail-back" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <h2 className="movie-detail-title">{title}</h2>
      {tagline && <p className="movie-detail-tagline">{tagline}</p>}

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

      <div className="movie-detail-info">
        <p>
          <strong>Release Date:</strong> {release_date}
        </p>
        <p>
          <strong>Runtime:</strong> {runtime ? `${runtime} mins` : "N/A"}
        </p>
        <p>
          <strong>Rating:</strong> {vote_average ? vote_average.toFixed(1) : "N/A"}
        </p>
        <p>
          <strong>Genres:</strong> {genres?.map((g) => g.name).join(", ") || "N/A"}
        </p>
        <br></br>

        <p className="movie-detail-overview">{overview}</p>
      </div>

      <h3 className="movie-detail-cast-heading">Cast</h3>
      <div className="movie-detail-cast-scroll">
        {cast
          .filter((actor) => actor.profile_path)
          .slice(0, 20)
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
