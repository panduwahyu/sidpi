import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { storyAPI } from '../services/api';
import DataTable from './DataTable';
import './StoryDetail.css';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const StoryDetail = () => {
  const { slug } = useParams();
  const [story, setStory] = useState(null);
  const [showDataTable, setShowDataTable] = useState(false);
  const [tableData, setTableData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStory();
  }, [slug]);

  const fetchStory = async () => {
    try {
      setLoading(true);
      const response = await storyAPI.getBySlug(slug);
      setStory(response.data);
    } catch (err) {
      setError('Cerita tidak ditemukan');
    } finally {
      setLoading(false);
    }
  };

  const handleShowData = async () => {
    if (!showDataTable) {
      try {
        const response = await storyAPI.getDataTable(slug);
        setTableData(response.data);
        setShowDataTable(true);
      } catch (err) {
        alert('Gagal memuat data tabel');
      }
    } else {
      setShowDataTable(false);
    }
  };

  const renderChart = () => {
    if (!story.chart_data || !story.chart_config) return null;

    const chartProps = {
      data: story.chart_data,
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: story.chart_config.title || story.title,
          },
        },
        ...story.chart_config.options
      },
    };

    switch (story.chart_type) {
      case 'line':
        return <Line {...chartProps} />;
      case 'bar':
      case 'column':
        return <Bar {...chartProps} />;
      case 'pie':
        return <Pie {...chartProps} />;
      default:
        return <Line {...chartProps} />;
    }
  };

  if (loading) {
    return (
      <div className="story-container">
        <div className="loading">Memuat cerita data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="story-container">
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="story-container">
      <article className="story-detail">
        {/* Header */}
        <header className="story-header">
          <h1>{story.title}</h1>
          <p className="story-description">{story.description}</p>
          <div className="story-meta">
            <span>Dipublikasikan: {new Date(story.published_at).toLocaleDateString('id-ID')}</span>
            <span>Oleh: {story.creator?.name}</span>
          </div>
        </header>

        {/* Featured Image */}
        {story.featured_image && (
          <div className="featured-image">
            <img src={`/storage/${story.featured_image}`} alt={story.title} />
          </div>
        )}

        {/* Story Content */}
        <div className="story-content">
          <div dangerouslySetInnerHTML={{ __html: story.story_content }} />
        </div>

        {/* Chart Section */}
        <div className="chart-section">
          <h2>Visualisasi Data</h2>
          <div className="chart-container">
            {renderChart()}
          </div>
        </div>

        {/* Additional Images */}
        {story.images && story.images.length > 0 && (
          <div className="story-images">
            <h3>Gambar Pendukung</h3>
            <div className="images-grid">
              {story.images.map((image, index) => (
                <div key={index} className="image-item">
                  <img src={`/storage/${image.image_path}`} alt={image.caption || `Gambar ${index + 1}`} />
                  {image.caption && <p className="image-caption">{image.caption}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Data Table Section */}
        <div className="data-section">
          <button 
            onClick={handleShowData}
            className="show-data-btn"
          >
            {showDataTable ? 'Sembunyikan Data' : 'Lihat Data'}
          </button>
          
          {showDataTable && tableData && (
            <DataTable data={tableData.data} config={tableData.config} />
          )}
        </div>
      </article>
    </div>
  );
};

export default StoryDetail;