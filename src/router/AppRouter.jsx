import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { useAuth } from '../context/AuthContext';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import MovieDetail from '../pages/MovieDetail';
import Navbar from '../components/Navbar';

const AppRouter = () => {
  const { currentUser } = useAuth();

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-dark-main">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route 
            path="/login" 
            element={!currentUser ? <Login /> : <Navigate to="/" />} 
          />
          <Route 
            path="/register" 
            element={!currentUser ? <Register /> : <Navigate to="/" />} 
          />
          <Route 
            path="/movies/:id" 
            element={currentUser ? <MovieDetail /> : <Navigate to="/login" />} 
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default AppRouter; 