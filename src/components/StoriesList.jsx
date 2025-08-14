import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { storyAPI } from '../services/api';
import './StoriesList.css';

const StoriesList = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchStories();
  }, [searchTerm]);

  const fetchStories = async () => {
    try {
      setLoading(true);
      const response = await storyAPI.getAll({ search: searchTerm });
      setStories(response.data.data || response.data);
    } catch (err) {
      setError('Gagal memuat cerita data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="stories-container">
        <div className="loading">Memuat cerita data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="stories-container">
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="stories-container">
      <header className="stories-header">
        <h1>Cerita Data Pengangguran Indonesia</h1>
        <p>Jelajahi insight mendalam tentang tren pengangguran melalui visualisasi data yang menarik</p>
        
        <div className="search-section">
          <input
            type="text"
            placeholder="Cari cerita data..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </header>

      <div className="stories-grid">
        {stories.map((story) => (
          <div key={story.id} className="story-card">
            {story.featured_image && (
              <div className="story-image">
                <img src={`/storage/${story.featured_image}`} alt={story.title} />
              </div>
            )}
            <div className="story-content">
              <h3>{story.title}</h3>
              <p>{story.description}</p>
              <div className="story-meta">
                <span className="chart-type">{story.chart_type.toUpperCase()}</span>
                <span className="publish-date">
                  {new Date(story.published_at).toLocaleDateString('id-ID')}
                </span>
              </div>
              <Link to={`/stories/${story.slug}`} className="read-more-btn">
                Baca Cerita
              </Link>
            </div>
          </div>
        ))}
      </div>

      {stories.length === 0 && (
        <div className="no-stories">
          <p>Belum ada cerita data tersedia.</p>
        </div>
      )}
    </div>
  );
};

export default StoriesList;