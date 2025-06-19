import { useState, useEffect } from "react";
import { useFavorites } from "../contexts/FavoritesContext";
import { useAuth } from "../contexts/AuthContext";
import "../styles/components/FavoriteButton.css";

export default function FavoriteButton({ movie }) {
  const { user } = useAuth();
  const { addFavorite, removeFavorite, isFavorite, loading } = useFavorites();
  const [isFav, setIsFav] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Sync with context state
  useEffect(() => {
    setIsFav(isFavorite(movie.id));
  }, [isFavorite, movie.id]);

  const handleClick = async (e) => {
    e.preventDefault();
    if (!user || isProcessing || !movie?.id) return;

    setIsProcessing(true);
    try {
      if (isFav) {
        await removeFavorite(movie.id);
      } else {
        await addFavorite(movie);
      }
    } catch (err) {
      console.error("Failed to update favorite", err);
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) return null; // Hide button while loading

  return (
    <button
      onClick={handleClick}
      className={`favorite-button ${isFav ? "active" : ""}`}
      disabled={isProcessing || !user}
      aria-label={
        !user ? "Login to favorite" :
        isFav ? "Remove from favorites" : "Add to favorites"
      }
    >
      {isProcessing ? "..." : (isFav ? "❤️" : "🤍")}
    </button>
  );
}
