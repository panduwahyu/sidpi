import React from 'react';
import { Link } from 'react-router-dom';
import './Homepage.css';

const Homepage = () => {
  return (
    <div className="homepage">
      {/* Header */}
      <header className="header">
        <div className="container">
          <div className="header-content">
            <div className="logo-section">
              <div className="bps-logo">
                <img 
                  src="/GKL3_Badan Pusat Statistik (BPS) - Koleksilogo.com.png" 
                  alt="BPS Logo" 
                  className="logo-image"
                />
              </div>
              <div className="title-section">
                <h1>Badan Pusat Statistik</h1>
                <p>Tren Pengangguran Indonesia</p>
              </div>
            </div>
            <Link to="/admin/login" className="login-btn">
              Login Admin
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h2>Memahami Pengangguran</h2>
            <p>
              Jelajahi data di balik salah satu indikator ekonomi terpenting dan 
              dampaknya terhadap masyarakat.
            </p>
            <Link to="/stories" className="cta-btn">
              Mulai Menjelajah
            </Link>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="content">
        <div className="container">
          <h3>Memahami Tren Pengangguran</h3>
          {/* Additional content can be added here */}
        </div>
      </section>
    </div>
  );
};

export default Homepage;