import React, { use } from "react";
import { useFavorites } from "../contexts/FavoritesContext";
import { useAuth } from "../contexts/AuthContext";
import "../styles/pages/Favorites.css";

export default function Favorites() {
  const { user } = useAuth();
  const { favorites, loading, removeFavorite } = useFavorites();

  if (!user) {
    return (
      <div className="favorites-container">
        <p>Please log in to view your favorites.</p>
      </div>
    );
  }
  if (loading) {
    return (
      <div className="favorites-container">
        <p>Loading your favorites...</p>
      </div>
    );
  }

  return (
    <div className="favorites-container">
      <h2>Your Favorite Movies</h2>

      {favorites.length === 0 ?
        <p>No favorite movies added yet.</p>
      : <ul className="favorites-list">
          {favorites.map((fav) => (
            <li key={fav.movieId} className="favorite-item">
              <img src={`https://image.tmdb.org/t/p/w200${fav.movieData.poster_path}`} alt={fav.movieData.title} className="favorite-poster" />
              <div className="favorite-details">
                <h3>{fav.movieData.title}</h3>
                <p>{fav.movieData.release_date}</p>
                <button onClick={() => removeFavorite(fav.movieId)} className="remove-button">
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      }
    </div>
  );
}
