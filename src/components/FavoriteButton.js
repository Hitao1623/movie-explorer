import { useFavorites } from "../contexts/FavoritesContext";
import "../styles/components/FavoriteButton.css";

export default function FavoriteButton({ movie }) {
  const { id } = movie;
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();

  const handleClick = (e) => {
    e.preventDefault();
    isFavorite(id) ? removeFavorite(id) : addFavorite(movie);
  };

  return (
    <button
      onClick={handleClick}
      className={`favorite-button ${isFavorite(id) ? "active" : ""}`}
      aria-label={isFavorite(id) ? "Remove from favorites" : "Add to favorites"}>
      {isFavorite(id) ? "❤️" : "🤍"}
    </button>
  );
}
