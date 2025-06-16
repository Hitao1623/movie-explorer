import { Link } from "react-router-dom";
import "./MovieCard.css";
import { useFavorites } from "../contexts/FavoritesContext";
import { useState } from "react";

export default function MovieCard({ movie }) {
  const { id, title, poster_path, release_date, vote_average } = movie;

  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const [isHovered, setIsHovered] = useState(false);

  const imageUrl = poster_path ? `https://image.tmdb.org/t/p/w300${poster_path}` : "/default-poster.jpg";

  // Handle favorite toggle
  const handleFavoriteClick = (e) => {
    e.preventDefault();
    isFavorite(id) ? removeFavorite(id) : addFavorite(movie);
  };

  return (
    <div 
      className="movie-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="poster-container">
        <Link to={`/movie/${id}`}>
          <img src={imageUrl} alt={title} className="movie-poster" />
          {(isHovered || isFavorite(id)) && (
            <button 
              onClick={handleFavoriteClick}
              className={`favorite-button ${isFavorite(id) ? 'active' : ''}`}
              aria-label={isFavorite(id) ? "Remove from favorites" : "Add to favorites"}
            >
              {isFavorite(id) ? '❤️' : '🤍'}
            </button>
          )}
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
