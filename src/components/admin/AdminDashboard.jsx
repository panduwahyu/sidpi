// Updated AdminDashboard.jsx with correct CSS classes (src/components/admin/AdminDashboard.jsx)
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, Edit, Trash2, Eye, BarChart3, FileText, TrendingDown, 
  Users, MapPin, Calendar, AlertCircle, CheckCircle 
} from 'lucide-react';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [stories, setStories] = useState([]);
  const [stats, setStats] = useState({
    totalStories: 0,
    publishedStories: 0,
    draftStories: 0,
    reviewStories: 0,
    latestUnemploymentRate: 5.45,
    dataPoints: 15420
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  // Mock user data
  const user = {
    name: 'Admin Demo',
    role: 'admin_content'
  };

  // Mock data
  useEffect(() => {
    setTimeout(() => {
      const mockStories = [
        {
          id: 1,
          title: 'Tren Pengangguran Indonesia Q4 2024',
          description: 'Analisis mendalam tentang perkembangan tingkat pengangguran terbuka di Indonesia pada kuartal keempat 2024.',
          status: 'published',
          story_type: 'trend_analysis',
          time_period: 'Q4 2024',
          geographical_scope: 'national',
          created_at: '2024-01-10T10:00:00Z',
          updated_at: '2024-01-12T14:30:00Z',
          slug: 'tren-pengangguran-indonesia-q4-2024'
        },
        {
          id: 2,
          title: 'Pengangguran Usia Muda: Tantangan dan Solusi',
          description: 'Mengkaji fenomena tingginya tingkat pengangguran pada kelompok usia 15-24 tahun di Indonesia.',
          status: 'pending_approval',
          story_type: 'demographic_analysis',
          time_period: '2024',
          geographical_scope: 'national',
          created_at: '2024-01-08T09:15:00Z',
          updated_at: '2024-01-10T16:45:00Z',
          slug: 'pengangguran-usia-muda-tantangan-solusi'
        },
        {
          id: 3,
          title: 'Perbandingan TPT Antar Provinsi',
          description: 'Membandingkan tingkat pengangguran terbuka di berbagai provinsi Indonesia.',
          status: 'draft',
          story_type: 'regional_comparison',
          time_period: 'Q3 2024',
          geographical_scope: 'provincial',
          created_at: '2024-01-05T11:20:00Z',
          updated_at: '2024-01-07T13:10:00Z',
          slug: 'perbandingan-tpt-antar-provinsi'
        },
        {
          id: 4,
          title: 'Dampak Digitalisasi terhadap Ketenagakerjaan',
          description: 'Analisis dampak transformasi digital terhadap pola ketenagakerjaan di Indonesia.',
          status: 'draft',
          story_type: 'sectoral_analysis',
          time_period: '2020-2024',
          geographical_scope: 'national',
          created_at: '2024-01-03T08:30:00Z',
          updated_at: '2024-01-05T10:15:00Z',
          slug: 'dampak-digitalisasi-ketenagakerjaan'
        }
      ];

      setStories(mockStories);
      
      // Calculate stats
      const published = mockStories.filter(s => s.status === 'published').length;
      const draft = mockStories.filter(s => s.status === 'draft').length;
      const review = mockStories.filter(s => s.status === 'pending_approval').length;
      
      setStats(prev => ({
        ...prev,
        totalStories: mockStories.length,
        publishedStories: published,
        draftStories: draft,
        reviewStories: review
      }));
      
      setLoading(false);
    }, 1000);
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus cerita data ini?')) {
      setStories(prev => prev.filter(story => story.id !== id));
      alert('Cerita berhasil dihapus!');
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    setStories(prev => prev.map(story => 
      story.id === id ? { ...story, status: newStatus } : story
    ));
    
    if (newStatus === 'published') {
      alert('Cerita berhasil dipublikasikan!');
    } else {
      alert(`Status cerita berhasil diubah ke ${newStatus}!`);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      published: { class: 'status-approved', label: 'Dipublikasi', icon: CheckCircle },
      pending_approval: { class: 'status-pending', label: 'Review', icon: AlertCircle },
      draft: { class: 'status-draft', label: 'Draft', icon: Edit }
    };
    
    const config = statusConfig[status] || statusConfig.draft;
    const Icon = config.icon;
    
    return (
      <span className={`status-badge ${config.class}`}>
        <Icon size={12} className="mr-1" />
        {config.label}
      </span>
    );
  };

  const getStoryTypeLabel = (type) => {
    const types = {
      trend_analysis: 'Analisis Tren',
      regional_comparison: 'Perbandingan Regional',
      demographic_analysis: 'Analisis Demografis',
      sectoral_analysis: 'Analisis Sektoral',
      policy_impact: 'Dampak Kebijakan'
    };
    return types[type] || type;
  };

  const filteredStories = activeTab === 'all' 
    ? stories 
    : stories.filter(story => story.status === activeTab);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="loading">Memuat dashboard...</div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="container">
        {/* Header */}
        <div className="dashboard-header">
          <div className="dashboard-title">
            <TrendingDown className="h-8 w-8 text-blue-600 mr-2" />
            <div>
              <h1>Dashboard Admin SIDPI BPS</h1>
              <p>
                Selamat datang, {user?.name} ({user?.role === 'admin_content' ? 'Admin Konten' : 'Admin Persetujuan'})
              </p>
            </div>
          </div>
          <Link to="/admin/stories/create" className="btn-primary">
            <Plus size={20} />
            Cerita Baru
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-card-content">
              <div className="stat-info">
                <h3>Total Cerita</h3>
                <p className="stat-number">{stats.totalStories}</p>
              </div>
              <FileText className="stat-icon text-blue-600" />
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-card-content">
              <div className="stat-info">
                <h3>Dipublikasi</h3>
                <p className="stat-number approved">{stats.publishedStories}</p>
              </div>
              <CheckCircle className="stat-icon text-green-600" />
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-card-content">
              <div className="stat-info">
                <h3>Draft</h3>
                <p className="stat-number draft">{stats.draftStories}</p>
              </div>
              <Edit className="stat-icon text-gray-600" />
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-card-content">
              <div className="stat-info">
                <h3>Review</h3>
                <p className="stat-number pending">{stats.reviewStories}</p>
              </div>
              <AlertCircle className="stat-icon text-yellow-600" />
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-card-content">
              <div className="stat-info">
                <h3>TPT Nasional</h3>
                <p className="stat-number text-red-600">{stats.latestUnemploymentRate}%</p>
              </div>
              <TrendingDown className="stat-icon text-red-600" />
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-card-content">
              <div className="stat-info">
                <h3>Data Points</h3>
                <p className="stat-number">{stats.dataPoints.toLocaleString()}</p>
              </div>
              <BarChart3 className="stat-icon text-blue-600" />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="actions-grid">
          <Link to="/admin/stories/create" className="action-card">
            <div className="action-icon blue">
              <Plus className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="action-title">Cerita Baru</h3>
            <p className="action-description">Buat cerita data pengangguran baru</p>
          </Link>

          <div className="action-card">
            <div className="action-icon green">
              <BarChart3 className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="action-title">Import Data</h3>
            <p className="action-description">Upload data pengangguran terbaru</p>
          </div>

          <div className="action-card">
            <div className="action-icon orange">
              <TrendingDown className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="action-title">Analytics</h3>
            <p className="action-description">Lihat statistik penggunaan</p>
          </div>

          <div className="action-card">
            <div className="action-icon purple">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="action-title">Pengaturan</h3>
            <p className="action-description">Kelola pengguna dan sistem</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="tabs">
          <button 
            className={`tab ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            Semua ({stories.length})
          </button>
          <button 
            className={`tab ${activeTab === 'draft' ? 'active' : ''}`}
            onClick={() => setActiveTab('draft')}
          >
            Draft ({stats.draftStories})
          </button>
          <button 
            className={`tab ${activeTab === 'pending_approval' ? 'active' : ''}`}
            onClick={() => setActiveTab('pending_approval')}
          >
            Review ({stats.reviewStories})
          </button>
          <button 
            className={`tab ${activeTab === 'published' ? 'active' : ''}`}
            onClick={() => setActiveTab('published')}
          >
            Dipublikasi ({stats.publishedStories})
          </button>
        </div>

        {/* Stories Table */}
        <div className="stories-table">
          <div className="table-header">
            <h2>Cerita Data Terbaru</h2>
          </div>
          
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Judul Cerita</th>
                  <th>Jenis</th>
                  <th>Periode</th>
                  <th>Cakupan</th>
                  <th>Status</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredStories.map((story) => (
                  <tr key={story.id}>
                    <td>
                      <div className="story-title">{story.title}</div>
                      <div className="story-description">
                        {story.description?.substring(0, 80)}...
                      </div>
                    </td>
                    <td>{getStoryTypeLabel(story.story_type)}</td>
                    <td>{story.time_period}</td>
                    <td>
                      <div className="flex items-center">
                        <MapPin size={14} className="mr-1" />
                        {story.geographical_scope === 'national' ? 'Nasional' : 
                         story.geographical_scope === 'provincial' ? 'Provinsi' : 'Lainnya'}
                      </div>
                    </td>
                    <td>{getStatusBadge(story.status)}</td>
                    <td>
                      <div className="action-buttons">
                        <Link
                          to={`/stories/${story.slug}`}
                          className="action-btn blue"
                          title="Lihat"
                        >
                          <Eye size={16} />
                        </Link>
                        <Link
                          to={`/admin/stories/${story.id}/edit`}
                          className="action-btn yellow"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </Link>
                        {story.status === 'draft' && (
                          <button
                            onClick={() => handleStatusChange(story.id, 'pending_approval')}
                            className="action-btn orange"
                            title="Kirim untuk Review"
                          >
                            <AlertCircle size={16} />
                          </button>
                        )}
                        {story.status === 'pending_approval' && (
                          <button
                            onClick={() => handleStatusChange(story.id, 'published')}
                            className="action-btn green"
                            title="Publikasikan"
                          >
                            <CheckCircle size={16} />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(story.id)}
                          className="action-btn red"
                          title="Hapus"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredStories.length === 0 && (
            <div className="empty-state">
              <TrendingDown className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <h3>
                {activeTab === 'all' 
                  ? 'Belum ada cerita data pengangguran.' 
                  : `Tidak ada cerita dengan status ${activeTab}.`
                }
              </h3>
              <p>Mulai buat cerita data untuk menampilkan informasi di sini.</p>
              <Link to="/admin/stories/create">
                Buat cerita pertama
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;