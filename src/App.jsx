// App.jsx

import React from "react";
import { BrowserRouter } from "react-router-dom";
import AppRouter from "./router/AppRouter";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";

function App() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-dark-main transition-colors duration-300">
      <BrowserRouter>
        <AuthProvider>
          <Navbar />
          <AppRouter />
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
