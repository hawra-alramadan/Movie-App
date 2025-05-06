import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { toastErrorNotify } from "../helper/ToastNotify";
import { Link } from "react-router-dom";

const MovieDetail = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [trailerKey, setTrailerKey] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const baseImageUrl = "https://image.tmdb.org/t/p/w1280";
  const defaultImage =
    "https://images.unsplash.com/photo-1581905764498-f1b60bae941a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=700&q=80";

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
        <p className="text-2xl text-red-500">Movie not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Movie Title */}
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">
          {movie.title}
        </h1>

        {/* Trailer */}
        {trailerKey && (
          <div className={`${isFullscreen ? "fixed inset-0 z-50" : ""} mb-12`}>
            <div className="relative" style={{ paddingTop: "56.25%" }}>
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
                {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
              </button>
            </div>
          </div>
        )}

        {/* Movie Details Layout */}
        <div className="flex justify-center px-10 mt-6">
          <div className="flex flex-col lg:flex-row w-2/3 rounded-lg shadow-lg bg-gray-100 dark:bg-gray-800">
            {/* Poster Image */}
            <img
              className="lg:w-1/3 h-96 lg:h-[600px] object-cover rounded-t-lg md:rounded-none md:rounded-l-lg"
              src={
                movie.poster_path
                  ? baseImageUrl + movie.poster_path
                  : defaultImage
              }
              alt="poster"
            />
            <div className="p-6 flex flex-col justify-between">
              <div>
                <h5 className="text-xl font-medium mb-2 text-black dark:text-white">
                  Overview
                </h5>
                <p className="text-base mb-4 text-black dark:text-white">
                  {movie.overview}
                </p>
              </div>
              <ul className="rounded-lg border border-gray-400 text-black dark:text-white">
                <li className="px-6 py-2 border-b border-gray-400">
                  Release Date: {movie.release_date}
                </li>
                <li className="px-6 py-2 border-b border-gray-400">
                  Rate: {movie.vote_average?.toFixed(1)}
                </li>
                <li className="px-6 py-2 border-b border-gray-400">
                  Total Vote: {movie.vote_count}
                </li>
                <li className="px-6 py-2">
                  <Link
                    to={-1}
                    className="text-blue-600 hover:text-blue-700 transition"
                  >
                    Go Back
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;
