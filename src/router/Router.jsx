// src/App.js
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "../components/Navbar";
import MovieCard from "../components/MovieCard";
import VideoSection from "../components/VideoSection";
import Home from "../pages/Home";
import MovieDetail from "../pages/MovieDetail";
import Login from "../pages/Login";
import Register from "../pages/Register";
import PrivateRouter from "./PrivateRouter";
// import Register from "../pages/Register";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-dark-main">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/movies/:id"
            element={
              <PrivateRouter>
                <MovieDetail />
              </PrivateRouter>
            }
          />
          <Route path="*" element={<Home />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default AppRouter;
