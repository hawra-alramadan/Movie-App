import React, { useState, useEffect } from "react";
import { toastErrorNotify, toastSuccessNotify } from "../helper/ToastNotify";
import MovieCard from "../components/MovieCard";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const { currentUser } = useAuth();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch movies based on search query or show popular movies
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        setError(null);

        const apiKey = import.meta.env.VITE_TMDB_KEY;

        if (!apiKey) {
          throw new Error("API key is missing in the .env file");
        }

        const endpoint = searchQuery
          ? `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(
              searchQuery
            )}`
          : `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}`;

        const response = await fetch(endpoint);

        if (!response.ok) {
          throw new Error("Failed to fetch movies");
        }

        const data = await response.json();
        setMovies(data.results);
      } catch (err) {
        setError(err.message);
        toastErrorNotify(`Error loading movies: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchMovies();
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleAddFavorite = async (movie) => {
    try {
      console.log("Adding favorite:", movie.title);
      toastSuccessNotify(`${movie.title} added to favorites!`);
    } catch (err) {
      toastErrorNotify(err.message);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-dark-main transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Updated Search Bar */}
        <form className="flex justify-center p-2 my-5" onSubmit={handleSearchSubmit}>
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-80 h-11 mr-2 block bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Search movies..."
          />
          <button
            type="submit"
            className="border-2 border-red-600 text-red-600 px-4 h-11 rounded-lg hover:bg-red-800 hover:text-white transition"
            disabled={!currentUser}
          >
            Search
          </button>
        </form>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-main"></div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-main bg-opacity-10 text-red-main p-4 mb-6 rounded-md">
            <p>{error}</p>
          </div>
        )}

        {/* Movie Grid */}
        {!loading && !error && (
          <>
            {searchQuery && (
              <h2 className="text-2xl font-bold mb-6 text-gray-dark-main dark:text-gray-light transition-colors duration-300">
                Results for "{searchQuery}"
              </h2>
            )}

            {movies.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
                {movies.map((movie) => (
                  <MovieCard
                    key={movie.id}
                    movie={movie}
                    onAddFavorite={handleAddFavorite}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 text-gray-dark-main dark:text-gray-light transition-colors duration-300">
                <p className="text-xl">No movies found</p>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="mt-4 px-4 py-2 bg-red-main text-white rounded-md hover:bg-red-600 transition-colors duration-300"
                  >
                    Show Popular Movies
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
