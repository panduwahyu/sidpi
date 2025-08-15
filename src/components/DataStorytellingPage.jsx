import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './DataStorytellingPage.css';

const DataStorytellingPage = () => {
  const [showTable, setShowTable] = useState(false);

  // Data pengangguran Indonesia (contoh data)
  const unemploymentTrend = [
    { tahun: '2018', tingkat: 5.34, jumlah: 7.0 },
    { tahun: '2019', tingkat: 5.28, jumlah: 7.05 },
    { tahun: '2020', tingkat: 7.07, jumlah: 9.77 },
    { tahun: '2021', tingkat: 6.49, jumlah: 9.10 },
    { tahun: '2022', tingkat: 5.86, jumlah: 8.40 },
    { tahun: '2023', tingkat: 5.32, jumlah: 7.86 },
    { tahun: '2024', tingkat: 4.82, jumlah: 7.15 }
  ];

  const unemploymentByProvince = [
    { provinsi: 'Jawa Barat', tingkat: 6.2 },
    { provinsi: 'Jawa Tengah', tingkat: 4.8 },
    { provinsi: 'Jawa Timur', tingkat: 4.1 },
    { provinsi: 'Jakarta', tingkat: 5.9 },
    { provinsi: 'Sumatera Utara', tingkat: 5.5 },
    { provinsi: 'Sulawesi Selatan', tingkat: 4.3 },
    { provinsi: 'Kalimantan Timur', tingkat: 3.8 },
    { provinsi: 'Papua', tingkat: 2.9 }
  ];

  const unemploymentByEducation = [
    { pendidikan: 'SD ke bawah', persentase: 2.8 },
    { pendidikan: 'SMP', persentase: 4.2 },
    { pendidikan: 'SMA/SMK', persentase: 6.8 },
    { pendidikan: 'Diploma', persentase: 4.9 },
    { pendidikan: 'Sarjana+', persentase: 4.1 }
  ];

  const detailedData = [
    { tahun: 2018, tingkatPengangguran: 5.34, angkatanKerja: 131.01, bekerja: 124.01, pengangguran: 7.0, tpak: 69.20 },
    { tahun: 2019, tingkatPengangguran: 5.28, angkatanKerja: 133.56, bekerja: 126.51, pengangguran: 7.05, tpak: 69.25 },
    { tahun: 2020, tingkatPengangguran: 7.07, angkatanKerja: 138.22, bekerja: 128.45, pengangguran: 9.77, tpak: 69.21 },
    { tahun: 2021, tingkatPengangguran: 6.49, angkatanKerja: 140.15, bekerja: 131.05, pengangguran: 9.10, tpak: 69.26 },
    { tahun: 2022, tingkatPengangguran: 5.86, angkatanKerja: 143.72, bekerja: 135.32, pengangguran: 8.40, tpak: 69.06 },
    { tahun: 2023, tingkatPengangguran: 5.32, angkatanKerja: 147.70, bekerja: 139.84, pengangguran: 7.86, tpak: 69.44 },
    { tahun: 2024, tingkatPengangguran: 4.82, angkatanKerja: 148.32, bekerja: 141.17, pengangguran: 7.15, tpak: 69.09 }
  ];

  return (
    <div className="storytelling-page">
      {/* Header */}
      <header className="story-header">
        <div className="container">
          <Link to="/" className="back-btn">← Kembali ke Beranda</Link>
          <h1>Pengangguran di Indonesia: Sebuah Perjalanan Data</h1>
          <p className="subtitle">Memahami dinamika ketenagakerjaan Indonesia melalui data dan visualisasi</p>
        </div>
      </header>

      {/* Hero Image Section */}
      <section className="hero-image">
        <div className="container">
          <div className="image-placeholder">
            <div className="placeholder-content">
              <img 
                src="/lt6321bf1b73a28.jpg" 
                alt="Ilustrasi Data Ketenagakerjaan" 
                className="hero-image-content"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Story Content */}
      <div className="story-content">
        <div className="container">
          
          {/* Introduction */}
          <section className="story-section">
            <h2>Perjalanan Menuju Pemulihan</h2>
            <p className="lead">
              Pengangguran merupakan salah satu indikator ekonomi yang paling sensitif terhadap perubahan kondisi 
              ekonomi suatu negara. Di Indonesia, perjalanan tingkat pengangguran dalam beberapa tahun terakhir 
              mencerminkan dinamika ekonomi yang kompleks, mulai dari dampak pandemi hingga upaya pemulihan ekonomi.
            </p>
            <p>
              Mari kita telusuri bagaimana angka pengangguran di Indonesia berubah dari waktu ke waktu dan 
              faktor-faktor apa saja yang mempengaruhinya.
            </p>
          </section>

          {/* Trend Analysis */}
          <section className="story-section">
            <h2>Tren Pengangguran 2018-2024</h2>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={unemploymentTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="tahun" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name) => [
                      name === 'tingkat' ? `${value}%` : `${value} juta jiwa`,
                      name === 'tingkat' ? 'Tingkat Pengangguran' : 'Jumlah Pengangguran'
                    ]}
                  />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="tingkat" 
                    stroke="#3b82f6" 
                    fill="#3b82f6" 
                    fillOpacity={0.3}
                    name="tingkat"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="insight-box">
              <h4>💡 Insight Utama</h4>
              <p>
                <strong>Dampak Pandemi:</strong> Tingkat pengangguran melonjak dari 5,28% di 2019 menjadi 7,07% di 2020, 
                menandai dampak signifikan pandemi COVID-19 terhadap pasar kerja Indonesia.
              </p>
              <p>
                <strong>Pemulihan Berkelanjutan:</strong> Sejak 2021, terjadi perbaikan konsisten dengan penurunan 
                tingkat pengangguran hingga mencapai 4,82% di 2024, menunjukkan resiliensi ekonomi Indonesia.
              </p>
            </div>
          </section>

          {/* Regional Analysis */}
          <section className="story-section">
            <h2>Disparitas Regional</h2>
            <p>
              Tingkat pengangguran tidak tersebar merata di seluruh Indonesia. Beberapa provinsi menghadapi 
              tantangan ketenagakerjaan yang lebih besar dibanding provinsi lainnya.
            </p>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={unemploymentByProvince} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 7]} />
                  <YAxis dataKey="provinsi" type="category" width={120} />
                  <Tooltip formatter={(value) => [`${value}%`, 'Tingkat Pengangguran']} />
                  <Bar dataKey="tingkat" fill="#f97316" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="insight-box warning">
              <h4>⚠️ Perhatian Khusus</h4>
              <p>
                Jawa Barat memiliki tingkat pengangguran tertinggi (6,2%), sementara Papua memiliki yang terendah (2,9%). 
                Perbedaan ini mencerminkan variasi struktur ekonomi dan peluang kerja antar daerah.
              </p>
            </div>
          </section>

          {/* Education Analysis */}
          <section className="story-section">
            <h2>Pengangguran Berdasarkan Tingkat Pendidikan</h2>
            <p>
              Paradoks pengangguran terdidik menjadi fenomena menarik di Indonesia, di mana lulusan SMA/SMK 
              memiliki tingkat pengangguran yang relatif tinggi.
            </p>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={unemploymentByEducation}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="pendidikan" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value}%`, 'Tingkat Pengangguran']} />
                  <Line 
                    type="monotone" 
                    dataKey="persentase" 
                    stroke="#10b981" 
                    strokeWidth={3}
                    dot={{ fill: '#10b981', strokeWidth: 2, r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="insight-box success">
              <h4>📚 Temuan Penting</h4>
              <p>
                Lulusan SMA/SMK memiliki tingkat pengangguran tertinggi (6,8%), menunjukkan adanya kesenjangan 
                antara keterampilan yang dimiliki dengan kebutuhan pasar kerja.
              </p>
            </div>
          </section>

          {/* Call to Action */}
          <section className="story-section cta-section">
            <h2>Ingin Melihat Data Lengkap?</h2>
            <p>
              Eksplorasi lebih dalam dengan data detail tingkat pengangguran, angkatan kerja, 
              dan indikator ketenagakerjaan lainnya.
            </p>
            <button 
              className="data-btn"
              onClick={() => setShowTable(!showTable)}
            >
              {showTable ? 'Sembunyikan Data' : 'Lihat Data Lengkap'} 📊
            </button>
          </section>

          {/* Data Table */}
          {showTable && (
            <section className="data-table-section">
              <h3>Tabel Data Ketenagakerjaan Indonesia</h3>
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Tahun</th>
                      <th>Tingkat Pengangguran (%)</th>
                      <th>Angkatan Kerja (Juta)</th>
                      <th>Bekerja (Juta)</th>
                      <th>Pengangguran (Juta)</th>
                      <th>TPAK (%)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {detailedData.map((row) => (
                      <tr key={row.tahun}>
                        <td>{row.tahun}</td>
                        <td>{row.tingkatPengangguran}</td>
                        <td>{row.angkatanKerja}</td>
                        <td>{row.bekerja}</td>
                        <td>{row.pengangguran}</td>
                        <td>{row.tpak}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="table-note">
                <p><strong>Catatan:</strong></p>
                <ul>
                  <li>TPAK = Tingkat Partisipasi Angkatan Kerja</li>
                  <li>Data dalam jutaan jiwa untuk angkatan kerja, bekerja, dan pengangguran</li>
                  <li>Sumber: Badan Pusat Statistik (BPS)</li>
                </ul>
              </div>
            </section>
          )}

          {/* Conclusion */}
          <section className="story-section conclusion">
            <h2>Kesimpulan dan Outlook</h2>
            <div className="conclusion-grid">
              <div className="conclusion-card">
                <h4>🎯 Pencapaian Positif</h4>
                <p>Indonesia berhasil menurunkan tingkat pengangguran dari puncak pandemi 7,07% menjadi 4,82% pada 2024.</p>
              </div>
              <div className="conclusion-card">
                <h4>🔍 Tantangan Tersisa</h4>
                <p>Disparitas regional dan pengangguran lulusan SMA/SMK masih memerlukan perhatian khusus.</p>
              </div>
              <div className="conclusion-card">
                <h4>🚀 Prospek ke Depan</h4>
                <p>Fokus pada peningkatan kualitas SDM dan penciptaan lapangan kerja berkualitas menjadi kunci.</p>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

export default DataStorytellingPage;