import React, { useContext } from "react";
import { useFavorites } from "../contexts/FavoritesContext";
import { AuthContext } from "../contexts/AuthContext";

export default function Favorites() {
  const { user } = useContext(AuthContext);
  const { favorites, removeFavorite } = useFavorites();

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Your Favorite Movies</h2>
      {!user ? (
        <p>Please log in to view your favorites.</p>
      ) : favorites.length === 0 ? (
        <p>No favorite movies added yet.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {favorites.map((movie) => (
            <li key={movie.id} style={{ display: "flex", marginBottom: "1rem" }}>
              <img
                src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                alt={movie.title}
                style={{ marginRight: "1rem" }}
              />
              <div>
                <strong>{movie.title}</strong>
                <p>{movie.release_date}</p>
                <button onClick={() => removeFavorite(movie.id)}>Remove</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
