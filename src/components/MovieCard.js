import { Link } from "react-router-dom";
import { useState } from "react";
import FavoriteButton from "./FavoriteButton";
import "../styles/components/MovieCard.css";

// MovieCard component receives a movie object as prop
export default function MovieCard({ movie }) {
  // State: track if mouse is hovering on this card (used to show hover effect)
  const [isHovered, setIsHovered] = useState(false);
  // Destructure fields from movie object
  const { id, title, poster_path, release_date, vote_average } = movie;

  // Compute image URL for movie poster (fallback to default image if none)
  const imageUrl =
    poster_path ?
      `https://image.tmdb.org/t/p/w300${poster_path}` // If poster available
    : "/default-poster.jpg"; // Fallback image

  // Render MovieCard
  return (
    <div
      className="movie-card"
      // When mouse enters card area, set hover state to true
      onMouseEnter={() => setIsHovered(true)}
      // When mouse leaves card area, set hover state to false
      onMouseLeave={() => setIsHovered(false)}>
      {/* Movie poster and rating */}
      <div className="poster-container">
        {/* Link to MovieDetail page */}
        <Link to={`/movie/${id}`}>
          {/* Movie poster image */}
          <img src={imageUrl} alt={title} className="movie-poster" />
        </Link>

        {/* Show FavoriteButton — always visible here (|| true) */}
        {(isHovered || true) && <FavoriteButton movie={movie} />}

        {/* Movie rating displayed at bottom-right */}
        <div className="movie-rating-bottom">
          <span className="star">★</span> {(vote_average || 0).toFixed(1)}
        </div>
      </div>

      {/* Movie title and release date */}
      <div className="movie-info-centered">
        {/* Movie title is a clickable link */}
        <Link to={`/movie/${id}`} className="movie-title-link">
          <h4 className="movie-title">{title}</h4>
        </Link>

        {/* Release date text with label */}
        <div className="movie-release">
          <div className="release-label">Release Date:</div>
          <div className="release-date">{release_date || "Unknown"}</div>
        </div>
      </div>
    </div>
  );
}
