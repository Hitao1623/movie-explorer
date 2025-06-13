import { Link } from "react-router-dom";
import "./MovieCard.css";

export default function MovieCard({ movie }) {
  const { id, title, poster_path, release_date, vote_average } = movie;

  return (
    <div className="movie-card">
      <div className="poster-container">
        <Link to={`/movie/${id}`}>
          <img src={`https://image.tmdb.org/t/p/w300${poster_path}`} alt={title} className="movie-poster" />
        </Link>
        <div className="movie-rating-bottom">
          <span className="star">★</span> {(vote_average || 0).toFixed(1)}
        </div>
      </div>

      <div className="movie-info-centered">
        <Link to={`/movie/${id}`} className="movie-title-link">
          <h4 className="movie-title">{title}</h4>
        </Link>
        <p className="movie-release">{release_date}</p>
      </div>
    </div>
  );
}
