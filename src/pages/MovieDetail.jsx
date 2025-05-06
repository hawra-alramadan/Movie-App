import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { toastErrorNotify } from "../helper/ToastNotify";

const MovieDetail = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [trailerKey, setTrailerKey] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        setLoading(true);
        const apiKey = import.meta.env.VITE_TMDB_KEY;

        const movieResponse = await fetch(
          `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}`
        );

        if (!movieResponse.ok) {
          throw new Error("Failed to fetch movie details");
        }

        const movieData = await movieResponse.json();
        setMovie(movieData);

        const videosResponse = await fetch(
          `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${apiKey}`
        );

        if (!videosResponse.ok) {
          throw new Error("Failed to fetch videos");
        }

        const videosData = await videosResponse.json();
        const trailer = videosData.results.find(
          (video) => video.type === "Trailer" && video.site === "YouTube"
        );

        if (trailer) {
          setTrailerKey(trailer.key);
        }

      } catch (err) {
        setError(err.message);
        toastErrorNotify(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id]);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-600 text-xl">{error}</p>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-600 dark:text-gray-300 text-xl transition-colors duration-300">
          Movie not found
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Movie Title */}
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">
          {movie.title}
        </h1>

        {/* Trailer */}
        {trailerKey && (
          <div className={`${isFullscreen ? 'fixed inset-0 z-50' : ''} mb-12`}>
            <div className="relative" style={{ paddingTop: '56.25%' }}>
              <iframe
                className="absolute top-0 left-0 w-full h-full rounded-lg shadow-lg"
                src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=1&controls=1`}
                title="Movie Trailer"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
              <button
                onClick={toggleFullscreen}
                className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-4 py-2 rounded-lg hover:bg-opacity-75 transition-all duration-300"
              >
                {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
              </button>
            </div>
          </div>
        )}

        {/* Movie Details */}
        <div className="flex flex-col md:flex-row">
          {/* Poster */}
          <div className="md:w-1/3">
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              className="w-full rounded-lg"
            />
          </div>

          {/* Info */}
          <div className="p-8 md:w-2/3">
            <div className="flex items-center mb-4">
              <span className="text-yellow-500 mr-2">★</span>
              <span className="text-gray-800 dark:text-white">
                {movie.vote_average.toFixed(1)} / 10
              </span>
              <span className="mx-2 text-gray-400">•</span>
              <span className="text-gray-800 dark:text-white">
                {movie.release_date.split("-")[0]}
              </span>
              <span className="mx-2 text-gray-400">•</span>
              <span className="text-gray-800 dark:text-white">
                {movie.runtime} minutes
              </span>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                Overview
              </h2>
              <p className="text-gray-700 dark:text-gray-300">
                {movie.overview}
              </p>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                Genres
              </h2>
              <div className="flex flex-wrap gap-2">
                {movie.genres.map((genre) => (
                  <span
                    key={genre.id}
                    className="px-3 py-1 bg-orange-500 bg-opacity-10 text-orange-600 rounded-full text-sm"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default MovieDetail;
