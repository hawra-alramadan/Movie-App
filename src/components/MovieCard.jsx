import React from "react";
import { useNavigate } from "react-router-dom";

// MovieCard component to display movie details
const MovieCard = ({ movie }) => {
  const { title, poster_path, overview, vote_average, id } = movie;
  const posterUrl = `https://image.tmdb.org/t/p/w500${poster_path}`;
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/movies/${id}`);
  };

  return (
    <div 
      onClick={handleClick}
      className="movie"
    >
      {/* Movie Poster */}
      <img
        src={posterUrl}
        alt={title}
        className="w-full"
      />

      {/* Title Bar */}
      <div className="movie">
      <h5 className="p-3 text-sm font-medium text-white">{title}</h5>
      </div>

      {/* Movie Overlay */}
      <div className="movie-over">
        <div>
          <p className="text-sm">
            {overview ? overview.slice(0, 150) + "..." : "No overview available"}
          </p>
        </div>

        <div className="flex items-center mt-2">
          <span className="font-semibold text-sm">Rating: </span>
          <span className="ml-2 text-yellow-500 text-sm">
            {vote_average ? vote_average.toFixed(1) : "N/A"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
