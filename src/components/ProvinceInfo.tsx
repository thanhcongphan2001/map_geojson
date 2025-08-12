import "./ProvinceInfo.css";

interface ProvinceData {
  id: number;
  prov_code: string;
  prov_name: string;
  prov_fname: string;
  prov_ne: string;
  prov_fne: string;
  level: string;
  region: string | null;
  clime: string | null;
  sort: number;
  pop: number | null;
  area: number | null;
  gdp: number | null;
}

interface ProvinceInfoProps {
  province: ProvinceData | null;
}

const ProvinceInfo: React.FC<ProvinceInfoProps> = ({ province }) => {
  if (!province) {
    return (
      <div className="province-info">
        <div className="info-placeholder">
          <div className="placeholder-icon">🗺️</div>
          <h3>Chọn một tỉnh thành</h3>
          <p>Click vào bản đồ để xem thông tin chi tiết về tỉnh thành</p>

          <div className="instructions">
            <h4>💡 Hướng dẫn sử dụng</h4>
            <ul>
              <li>
                🖱️ <strong>Click</strong> vào tỉnh để xem thông tin
              </li>
              <li>
                🔍 <strong>Hover</strong> để xem tên tỉnh
              </li>
              <li>
                🏠 <strong>Reset</strong> để về tổng quan
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="province-info">
      <div className="province-header">
        <h2>{province.prov_name}</h2>
        <span className="province-code">Mã: {province.prov_code}</span>
      </div>

      <div className="province-details">
        <div className="detail-section">
          <h3>📍 Thông tin cơ bản</h3>
          <div className="detail-grid">
            <div className="detail-item">
              <span className="label">Tên đầy đủ:</span>
              <span className="value">{province.prov_fname}</span>
            </div>
            <div className="detail-item">
              <span className="label">Tên tiếng Anh:</span>
              <span className="value">{province.prov_fne}</span>
            </div>
            <div className="detail-item">
              <span className="label">Cấp hành chính:</span>
              <span className="value">{province.level}</span>
            </div>
            <div className="detail-item">
              <span className="label">Thứ tự:</span>
              <span className="value">#{province.sort}</span>
            </div>
          </div>
        </div>

        <div className="detail-section">
          <h3>📊 Thống kê</h3>
          <div className="stats-container">
            <div className="stat-card">
              <div className="stat-icon">👥</div>
              <div className="stat-content">
                <span className="stat-value">
                  {province.pop
                    ? province.pop.toLocaleString()
                    : "Chưa có dữ liệu"}
                </span>
                <span className="stat-title">Dân số</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">📏</div>
              <div className="stat-content">
                <span className="stat-value">
                  {province.area
                    ? `${province.area.toLocaleString()} km²`
                    : "Chưa có dữ liệu"}
                </span>
                <span className="stat-title">Diện tích</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">💰</div>
              <div className="stat-content">
                <span className="stat-value">
                  {province.gdp
                    ? `${province.gdp.toLocaleString()} tỷ VNĐ`
                    : "Chưa có dữ liệu"}
                </span>
                <span className="stat-title">GDP</span>
              </div>
            </div>
          </div>
        </div>

        <div className="detail-section">
          <h3>🌍 Thông tin bổ sung</h3>
          <div className="detail-grid">
            <div className="detail-item">
              <span className="label">Vùng miền:</span>
              <span className="value">
                {province.region || "Chưa phân loại"}
              </span>
            </div>
            <div className="detail-item">
              <span className="label">Khí hậu:</span>
              <span className="value">
                {province.clime || "Chưa có thông tin"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProvinceInfo;
