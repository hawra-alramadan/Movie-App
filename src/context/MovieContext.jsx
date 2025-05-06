// src/context/MovieContext.js
import { createContext, useContext, useState } from "react";

const MovieContext = createContext();

export const MovieProvider = ({ children }) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);

  const getMovies = async () => {
    setLoading(true);
    try {
      const apiKey = import.meta.env.VITE_TMDB_KEY;
      const res = await fetch(
        `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&page=1`
      );
      const data = await res.json();
      setMovies(data.results);
    } catch (error) {
      console.error("Movie Fetch Error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MovieContext.Provider value={{ movies, getMovies, loading }}>
      {children}
    </MovieContext.Provider>
  );
};

export const useMovies = () => useContext(MovieContext);
