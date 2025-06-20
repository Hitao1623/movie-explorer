import { useFavorites } from "../contexts/FavoritesContext";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";
import { FiTrash2, FiHome } from "react-icons/fi";
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
    <div className="favorites-page-wrapper">
      <div className="home-button-container">
        <Link to="/" className="home-button" title="Go to Home">
          <FiHome className="home-icon" />
          <span>Go to Home</span>
        </Link>
      </div>

      <div className="favorites-container">
        <div className="favorites-header">
          <h2>Your Favorite Movies</h2>
        </div>
        
        {favorites.length === 0 ? (
          <p>No favorite movies added yet.</p>
        ) : (
          <ul className="favorites-list">
            {favorites.map((fav) => (
              <li key={fav.movieId} className="favorite-item">
                <img
                  src={`https://image.tmdb.org/t/p/w200${fav.movieData.poster_path}`}
                  alt={fav.movieData.title}
                  className="favorite-poster"
                />
                <div className="favorite-details">
                  <h3>{fav.movieData.title}</h3>
                  <p>Release Date: {fav.movieData.release_date}</p>
                  <button 
                    onClick={() => removeFavorite(fav.movieId)}
                    className="remove-button"
                  >
                    Remove
                    <FiTrash2 />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
