import { createContext, useState, useContext, useEffect } from "react";
import { useAuth } from "./AuthContext"; 

const API_URL = "http://localhost:3001";

export const FavoritesContext = createContext(); 

export function useFavorites() {
  const context = useContext(FavoritesContext);
  return context;
}

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // Load user's favorites on login or page refresh
  useEffect(() => {
    if (user) {
      fetchFavorites();
    } else {
      setFavorites([]); // Clear favorites if user is not logged in
    }
  }, [user]);  // Dependency array 

  const fetchFavorites = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/favorites?userId=${user.id}`); 
      const data = await res.json();
      setFavorites(data);
    } catch (error) {
      console.error("Failed to fetch favorites:", error);
    } finally {
      setLoading(false);
    }
  }

  const addFavorite = async (movie) => {
    if (!user) return;
    
    try {
      await fetch(`${API_URL}/favorites`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          movieId: movie.id,
          movieData: movie // Store full movie details for display
        })
      });
      await fetchFavorites(); // Refresh list
    } catch (err) {
      console.error("Failed to add favorite", err);
    }
  };

  const removeFavorite = async (id) => {
    try {
      // Find the favorite record ID (not movie ID)
      const favoriteToRemove = favorites.find(fav => fav.movieId === id);
      if (favoriteToRemove) {
        await fetch(`${API_URL}/favorites/${favoriteToRemove.id}`, {
          method: "DELETE"
        });
        await fetchFavorites(); // Refresh list
        }
    } catch (err) {
      console.error("Failed to remove favorite", err);
    }
  };

  // check if movie is favorited
  const isFavorite = (id) => {
    return favorites.some(fav => fav.movieId === id);
  };

  return (
    <FavoritesContext.Provider 
      value={{ favorites, loading, addFavorite, removeFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}