import { createContext, useState, useContext } from "react";

export const FavoritesContext = createContext(); 

export function useFavorites() {
  const context = useContext(FavoritesContext);
  return context;
}

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState([]);

  const addFavorite = (movie) => {
    // Prevent duplicates
    if (!favorites.some((fav) => fav.id === movie.id)) {
      setFavorites([...favorites, movie]);
    }
  };

  const removeFavorite = (id) => {
    setFavorites(favorites.filter((movie) => movie.id !== id));
  };

  // check if movie is favorited
  const isFavorite = (id) => {
    return favorites.some((movie) => movie.id === id);
  };

  return (
    <FavoritesContext.Provider 
      value={{ favorites, addFavorite, removeFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}