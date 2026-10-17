import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import AppRoutes from './routes/AppRoutes';

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="d-flex flex-column min-vh-100">
          <Navbar />
          <main className="flex-grow-1">
            <AppRoutes />
          </main>
          <footer className="py-3 bg-white border-top text-center text-muted small mt-auto">
            <div className="container">
              <span>EduPortal &copy; {new Date().getFullYear()} &mdash; Secure Student Registration &amp; Administration System</span>
            </div>
          </footer>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
