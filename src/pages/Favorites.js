import { useFavorites } from "../context/FavoritesContext";
import MovieCard from "../components/MovieCard";

export default function Favorites() {
  const { favorites, removeFavorite } = useFavorites();

  if (favorites.length === 0) {
    return <p style={{ padding: "20px" }}>You have no favorite movies yet.</p>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>Your Favorite Movies</h2>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {favorites.map((movie) => (
          <div key={movie.id} style={{ position: "relative", margin: "10px" }}>
            <MovieCard movie={movie} />
            <button
              onClick={() => removeFavorite(movie.id)}
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                background: "red",
                color: "white",
                border: "none",
                cursor: "pointer",
                padding: "5px 10px",
              }}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
