import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { adminStoryAPI } from '../../services/api';
import './StoryEditor.css';

const StoryEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    story_content: '',
    chart_type: 'line',
    chart_config: {
      title: '',
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    },
    chart_data: {
      labels: [],
      datasets: [{
        label: 'Data',
        data: [],
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 2,
        fill: false
      }]
    },
    data_table_config: {
      title: 'Data Tabel',
      showDownload: true
    }
  });
  
  const [files, setFiles] = useState({
    featured_image: null,
    data_file: null,
    images: []
  });

  const [existingImages, setExistingImages] = useState([]);
  const [imageCaptions, setImageCaptions] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [previewChart, setPreviewChart] = useState(false);

  useEffect(() => {
    if (isEdit) {
      fetchStory();
    }
  }, [id, isEdit]);

  const fetchStory = async () => {
    try {
      setLoading(true);
      const response = await adminStoryAPI.getById(id);
      const story = response.data;
      
      setFormData({
        ...story,
        chart_config: story.chart_config || formData.chart_config,
        chart_data: story.chart_data || formData.chart_data,
        data_table_config: story.data_table_config || formData.data_table_config
      });
      
      if (story.images) {
        setExistingImages(story.images);
        const captions = {};
        story.images.forEach(img => {
          captions[img.id] = img.caption || '';
        });
        setImageCaptions(captions);
      }
    } catch (err) {
      setError('Gagal memuat cerita');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const { name, files: selectedFiles } = e.target;
    
    if (name === 'images') {
      const fileArray = Array.from(selectedFiles);
      setFiles(prev => ({
        ...prev,
        [name]: fileArray
      }));
      
      // Initialize captions for new images
      fileArray.forEach((file, index) => {
        setImageCaptions(prev => ({
          ...prev,
          [`new_${index}`]: ''
        }));
      });
    } else {
      setFiles(prev => ({
        ...prev,
        [name]: selectedFiles[0]
      }));
    }
  };

  const handleChartConfigChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      chart_config: {
        ...prev.chart_config,
        [field]: value
      }
    }));
  };

  const handleChartDataChange = (field, value) => {
    if (field === 'labels') {
      const labels = value.split(',').map(item => item.trim()).filter(item => item);
      setFormData(prev => ({
        ...prev,
        chart_data: {
          ...prev.chart_data,
          labels: labels
        }
      }));
    } else if (field === 'data') {
      const data = value.split(',').map(item => {
        const num = parseFloat(item.trim());
        return isNaN(num) ? 0 : num;
      });
      
      setFormData(prev => ({
        ...prev,
        chart_data: {
          ...prev.chart_data,
          datasets: [{
            ...prev.chart_data.datasets[0],
            data: data
          }]
        }
      }));
    } else if (field === 'label') {
      setFormData(prev => ({
        ...prev,
        chart_data: {
          ...prev.chart_data,
          datasets: [{
            ...prev.chart_data.datasets[0],
            label: value
          }]
        }
      }));
    }
  };

  const handleChartTypeChange = (e) => {
    const newType = e.target.value;
    setFormData(prev => {
      const newChartData = { ...prev.chart_data };
      
      // Adjust chart data based on type
      if (newType === 'pie') {
        newChartData.datasets[0] = {
          ...newChartData.datasets[0],
          backgroundColor: [
            '#3b82f6', '#10b981', '#f59e0b', '#ef4444', 
            '#8b5cf6', '#06b6d4', '#84cc16', '#f97316'
          ],
          borderColor: '#ffffff',
          borderWidth: 2
        };
      } else {
        newChartData.datasets[0] = {
          ...newChartData.datasets[0],
          backgroundColor: newType === 'line' 
            ? 'rgba(59, 130, 246, 0.1)' 
            : 'rgba(59, 130, 246, 0.8)',
          borderColor: '#3b82f6',
          borderWidth: 2
        };
      }
      
      return {
        ...prev,
        chart_type: newType,
        chart_data: newChartData
      };
    });
  };

  const handleImageCaptionChange = (imageId, caption) => {
    setImageCaptions(prev => ({
      ...prev,
      [imageId]: caption
    }));
  };

  const removeExistingImage = (imageId) => {
    setExistingImages(prev => prev.filter(img => img.id !== imageId));
    setImageCaptions(prev => {
      const newCaptions = { ...prev };
      delete newCaptions[imageId];
      return newCaptions;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const submitData = new FormData();
      
      // Add basic form data
      submitData.append('title', formData.title);
      submitData.append('description', formData.description);
      submitData.append('story_content', formData.story_content);
      submitData.append('chart_type', formData.chart_type);
      submitData.append('chart_config', JSON.stringify(formData.chart_config));
      submitData.append('chart_data', JSON.stringify(formData.chart_data));
      submitData.append('data_table_config', JSON.stringify(formData.data_table_config));

      // Add files
      if (files.featured_image) {
        submitData.append('featured_image', files.featured_image);
      }
      if (files.data_file) {
        submitData.append('data_file', files.data_file);
      }

      // Add new images with captions
      if (files.images.length > 0) {
        files.images.forEach((image, index) => {
          submitData.append(`images[${index}]`, image);
          submitData.append(`image_captions[${index}]`, imageCaptions[`new_${index}`] || '');
        });
      }

      // Add existing images data (for updates)
      if (isEdit) {
        submitData.append('existing_images', JSON.stringify(
          existingImages.map(img => ({
            id: img.id,
            caption: imageCaptions[img.id] || img.caption
          }))
        ));
      }

      let response;
      if (isEdit) {
        // For updates, we need to use POST with _method field due to FormData limitations
        submitData.append('_method', 'PUT');
        response = await adminStoryAPI.update(id, submitData);
      } else {
        response = await adminStoryAPI.create(submitData);
      }

      alert('Cerita berhasil disimpan!');
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal menyimpan cerita');
      console.error('Submit error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitForApproval = async () => {
    if (!isEdit) {
      alert('Simpan cerita terlebih dahulu sebelum mengajukan persetujuan');
      return;
    }

    try {
      await adminStoryAPI.submitForApproval(id);
      alert('Cerita berhasil diajukan untuk persetujuan');
      navigate('/admin/dashboard');
    } catch (err) {
      alert('Gagal mengajukan cerita untuk persetujuan');
      console.error(err);
    }
  };

  const validateForm = () => {
    if (!formData.title.trim()) return 'Judul cerita harus diisi';
    if (!formData.description.trim()) return 'Deskripsi harus diisi';
    if (!formData.story_content.trim()) return 'Konten cerita harus diisi';
    if (!formData.chart_data.labels.length) return 'Label chart harus diisi';
    if (!formData.chart_data.datasets[0].data.length) return 'Data chart harus diisi';
    if (formData.chart_data.labels.length !== formData.chart_data.datasets[0].data.length) {
      return 'Jumlah label dan data harus sama';
    }
    return null;
  };

  const validationError = validateForm();

  if (loading && isEdit) {
    return (
      <div className="story-editor">
        <div className="loading">Memuat data cerita...</div>
      </div>
    );
  }

  return (
    <div className="story-editor">
      <div className="editor-header">
        <h1>{isEdit ? 'Edit Cerita Data' : 'Buat Cerita Data Baru'}</h1>
        <button onClick={() => navigate('/admin/dashboard')} className="btn-back">
          ← Kembali ke Dashboard
        </button>
      </div>

      {error && (
        <div className="error-message">
          <strong>Error:</strong> {error}
        </div>
      )}

      {validationError && (
        <div className="warning-message">
          <strong>Perhatian:</strong> {validationError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="editor-form">
        {/* Basic Information */}
        <div className="form-section">
          <h2>📝 Informasi Dasar</h2>
          
          <div className="form-group">
            <label htmlFor="title">Judul Cerita *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              placeholder="Masukkan judul cerita yang menarik dan deskriptif"
              maxLength="255"
            />
            <small>{formData.title.length}/255 karakter</small>
          </div>

          <div className="form-group">
            <label htmlFor="description">Deskripsi Singkat *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows="3"
              placeholder="Deskripsi singkat yang akan muncul di halaman daftar cerita"
              maxLength="500"
            />
            <small>{formData.description.length}/500 karakter</small>
          </div>

          <div className="form-group">
            <label htmlFor="featured_image">Gambar Utama</label>
            <input
              type="file"
              id="featured_image"
              name="featured_image"
              onChange={handleFileChange}
              accept="image/jpeg,image/png,image/jpg"
            />
            <small>Format: JPG, PNG. Ukuran maksimal: 2MB. Resolusi disarankan: 1200x600px</small>
            {isEdit && formData.featured_image && (
              <div className="current-image">
                <p>Gambar saat ini:</p>
                <img src={`/storage/${formData.featured_image}`} alt="Current featured" style={{maxWidth: '200px', height: 'auto'}} />
              </div>
            )}
          </div>
        </div>

        {/* Story Content */}
        <div className="form-section">
          <h2>📖 Konten Cerita</h2>
          
          <div className="form-group">
            <label htmlFor="story_content">Narasi Cerita *</label>
            <textarea
              id="story_content"
              name="story_content"
              value={formData.story_content}
              onChange={handleInputChange}
              required
              rows="15"
              placeholder="Tulis narasi cerita data Anda di sini. Gunakan HTML untuk formatting.

Contoh:
<h3>Perkembangan Pengangguran</h3>
<p>Berdasarkan data BPS, tingkat pengangguran terbuka...</p>
<p><strong>Temuan utama:</strong></p>
<ul>
  <li>Penurunan TPT sebesar 0.5% dari tahun sebelumnya</li>
  <li>Pengangguran usia muda masih tinggi</li>
</ul>"
            />
            <small>
              <strong>Tips formatting:</strong> Gunakan &lt;h3&gt; untuk subjudul, &lt;p&gt; untuk paragraf, 
              &lt;strong&gt; untuk teks tebal, &lt;ul&gt;&lt;li&gt; untuk daftar
            </small>
          </div>
        </div>

        {/* Chart Configuration */}
        <div className="form-section">
          <h2>📊 Konfigurasi Chart</h2>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="chart_type">Jenis Chart *</label>
              <select
                id="chart_type"
                name="chart_type"
                value={formData.chart_type}
                onChange={handleChartTypeChange}
                required
              >
                <option value="line">📈 Line Chart - Untuk tren waktu</option>
                <option value="bar">📊 Bar Chart - Perbandingan horizontal</option>
                <option value="column">📊 Column Chart - Perbandingan vertikal</option>
                <option value="pie">🥧 Pie Chart - Proporsi/persentase</option>
                <option value="area">📈 Area Chart - Tren dengan area fill</option>
                <option value="scatter">⚡ Scatter Plot - Korelasi data</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="chart_title">Judul Chart</label>
              <input
                type="text"
                id="chart_title"
                value={formData.chart_config?.title || ''}
                onChange={(e) => handleChartConfigChange('title', e.target.value)}
                placeholder="Judul yang akan muncul di atas chart"
              />
            </div>
          </div>

          <div className="chart-data-section">
            <h4>📋 Data Chart</h4>
            
            <div className="form-group">
              <label htmlFor="chart_labels">Label/Kategori (Sumbu X) *</label>
              <input
                type="text"
                id="chart_labels"
                value={formData.chart_data?.labels?.join(', ') || ''}
                onChange={(e) => handleChartDataChange('labels', e.target.value)}
                placeholder="2020, 2021, 2022, 2023, 2024"
                required
              />
              <small>Pisahkan dengan koma. Contoh: "Januari, Februari, Maret" atau "2020, 2021, 2022"</small>
            </div>

            <div className="form-group">
              <label htmlFor="chart_data_values">Nilai Data (Sumbu Y) *</label>
              <input
                type="text"
                id="chart_data_values"
                value={formData.chart_data?.datasets?.[0]?.data?.join(', ') || ''}
                onChange={(e) => handleChartDataChange('data', e.target.value)}
                placeholder="5.5, 6.2, 5.8, 5.3, 4.9"
                required
              />
              <small>Pisahkan dengan koma. Gunakan titik untuk desimal. Contoh: "5.5, 6.2, 5.8"</small>
            </div>

            <div className="form-group">
              <label htmlFor="data_label">Label Dataset</label>
              <input
                type="text"
                id="data_label"
                value={formData.chart_data?.datasets?.[0]?.label || ''}
                onChange={(e) => handleChartDataChange('label', e.target.value)}
                placeholder="TPT (%)"
              />
              <small>Label yang akan muncul di legend chart</small>
            </div>

            {/* Chart Preview Button */}
            <div className="form-group">
              <button 
                type="button" 
                onClick={() => setPreviewChart(!previewChart)}
                className="btn btn-secondary"
              >
                {previewChart ? '🙈 Sembunyikan Preview' : '👁️ Preview Chart'}
              </button>
            </div>

            {/* Chart Preview */}
            {previewChart && formData.chart_data.labels.length > 0 && (
              <div className="chart-preview">
                <h5>Preview Chart:</h5>
                <div className="preview-container">
                  <p>Chart akan ditampilkan di sini saat implementasi Chart.js</p>
                  <div className="preview-data">
                    <strong>Type:</strong> {formData.chart_type}<br/>
                    <strong>Labels:</strong> {formData.chart_data.labels.join(', ')}<br/>
                    <strong>Data:</strong> {formData.chart_data.datasets[0].data.join(', ')}<br/>
                    <strong>Label:</strong> {formData.chart_data.datasets[0].label || 'Data'}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Data Source File */}
        <div className="form-section">
          <h2>📁 Sumber Data</h2>
          
          <div className="form-group">
            <label htmlFor="data_file">File Data Excel (XLSX/XLS)</label>
            <input
              type="file"
              id="data_file"
              name="data_file"
              onChange={handleFileChange}
              accept=".xlsx,.xls"
            />
            <small>
              <strong>Penting:</strong> Upload file Excel yang berisi data mentah. File ini akan ditampilkan 
              sebagai tabel saat user klik tombol "Lihat Data". Format: XLSX atau XLS. Maksimal 10MB.
            </small>
            {isEdit && formData.data_file_path && (
              <div className="current-file">
                <p>✅ File data saat ini sudah terupload</p>
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="table_title">Judul Tabel Data</label>
            <input
              type="text"
              id="table_title"
              value={formData.data_table_config?.title || ''}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                data_table_config: {
                  ...prev.data_table_config,
                  title: e.target.value
                }
              }))}
              placeholder="Data Tingkat Pengangguran Terbuka"
            />
            <small>Judul yang akan muncul di atas tabel data</small>
          </div>
        </div>

        {/* Additional Images */}
        <div className="form-section">
          <h2>🖼️ Gambar Pendukung</h2>
          
          {/* Existing Images (for edit mode) */}
          {isEdit && existingImages.length > 0 && (
            <div className="existing-images">
              <h4>Gambar Saat Ini:</h4>
              <div className="images-grid">
                {existingImages.map((image) => (
                  <div key={image.id} className="image-item">
                    <img src={`/storage/${image.image_path}`} alt={image.caption} />
                    <input
                      type="text"
                      placeholder="Caption gambar..."
                      value={imageCaptions[image.id] || ''}
                      onChange={(e) => handleImageCaptionChange(image.id, e.target.value)}
                    />
                    <button 
                      type="button" 
                      onClick={() => removeExistingImage(image.id)}
                      className="btn btn-danger btn-sm"
                    >
                      🗑️ Hapus
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* New Images Upload */}
          <div className="form-group">
            <label htmlFor="images">Upload Gambar Baru</label>
            <input
              type="file"
              id="images"
              name="images"
              onChange={handleFileChange}
              accept="image/jpeg,image/png,image/jpg"
              multiple
            />
            <small>Upload gambar pendukung untuk memperkaya cerita. Format: JPG, PNG. Maksimal 2MB per file.</small>
          </div>

          {/* New Images Preview with Captions */}
          {files.images.length > 0 && (
            <div className="new-images-preview">
              <h4>Preview Gambar Baru:</h4>
              <div className="images-grid">
                {files.images.map((file, index) => (
                  <div key={index} className="image-item">
                    <img 
                      src={URL.createObjectURL(file)} 
                      alt={`Preview ${index + 1}`}
                      style={{maxWidth: '200px', height: 'auto'}}
                    />
                    <input
                      type="text"
                      placeholder="Caption untuk gambar ini..."
                      value={imageCaptions[`new_${index}`] || ''}
                      onChange={(e) => handleImageCaptionChange(`new_${index}`, e.target.value)}
                    />
                    <small>{file.name}</small>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Form Actions */}
        <div className="form-actions">
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading || !!validationError}
          >
            {loading ? '⏳ Menyimpan...' : (isEdit ? '💾 Update Cerita' : '💾 Simpan Draft')}
          </button>
          
          {isEdit && formData.status === 'draft' && (
            <button 
              type="button"
              onClick={handleSubmitForApproval}
              className="btn btn-success"
              disabled={!!validationError}
            >
              📤 Ajukan untuk Persetujuan
            </button>
          )}
          
          <button 
            type="button" 
            onClick={() => navigate('/admin/dashboard')}
            className="btn btn-secondary"
          >
            ❌ Batal
          </button>
        </div>

        {/* Help Section */}
        <div className="help-section">
          <h3>💡 Tips Membuat Cerita Data yang Baik:</h3>
          <ul>
            <li><strong>Judul:</strong> Buat judul yang menarik dan menggambarkan insight utama</li>
            <li><strong>Narasi:</strong> Mulai dengan konteks, jelaskan temuan, dan berikan kesimpulan</li>
            <li><strong>Chart:</strong> Pilih jenis chart yang sesuai dengan jenis data Anda</li>
            <li><strong>Data:</strong> Pastikan data akurat dan sumber terpercaya</li>
            <li><strong>Gambar:</strong> Gunakan gambar yang relevan dan berkualitas tinggi</li>
          </ul>
        </div>
      </form>
    </div>
  );
};

export default StoryEditor;