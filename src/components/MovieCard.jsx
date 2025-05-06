import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Adjust this import path if needed

const MovieCard = ({ movie }) => {
  const { title, poster_path, overview, vote_average, id } = movie;
  const { currentUser } = useAuth();
  const posterUrl = `https://image.tmdb.org/t/p/w500${poster_path}`;
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/movies/${id}`);
  };

  return (
    <div onClick={handleClick} className="movie cursor-pointer relative">
      {/* Movie Poster */}
      <img src={posterUrl} alt={title} className="w-full" />

      {/* Title */}
      <div className="movie">
        <h5 className="p-3 text-sm font-medium text-white">{title}</h5>
      </div>

      {/* Overlay */}
      <div className="movie-over">
        <p className="text-sm text-white">
          {overview ? overview.slice(0, 150) + "..." : "No overview available"}
        </p>

        {/* Only show rating if user is signed in */}
        {currentUser && (
          <div className="flex justify-end mt-2">
            <div className="bg-yellow-400 text-black text-xs font-semibold px-2 py-1 rounded">
              {vote_average ? vote_average.toFixed(1) : "N/A"}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieCard;
