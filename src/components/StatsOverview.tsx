import { useEffect, useState } from 'react'
import './StatsOverview.css'

interface ProvinceData {
  id: number
  prov_code: string
  prov_name: string
  prov_fname: string
  prov_ne: string
  prov_fne: string
  level: string
  region: string | null
  clime: string | null
  sort: number
  pop: number | null
  area: number | null
  gdp: number | null
}

interface StatsOverviewProps {
  provinces: ProvinceData[]
  selectedProvince: ProvinceData | null
}

const StatsOverview: React.FC<StatsOverviewProps> = ({ provinces, selectedProvince }) => {
  const [stats, setStats] = useState({
    totalProvinces: 0,
    totalPopulation: 0,
    totalArea: 0,
    totalGDP: 0,
    averageArea: 0,
    largestProvince: null as ProvinceData | null,
    mostPopulous: null as ProvinceData | null
  })

  useEffect(() => {
    if (provinces.length > 0) {
      const validProvinces = provinces.filter(p => p.area && p.pop && p.gdp)
      
      const totalPop = validProvinces.reduce((sum, p) => sum + (p.pop || 0), 0)
      const totalArea = validProvinces.reduce((sum, p) => sum + (p.area || 0), 0)
      const totalGDP = validProvinces.reduce((sum, p) => sum + (p.gdp || 0), 0)
      
      const largestByArea = provinces.reduce((largest, current) => {
        if (!largest || (current.area && (!largest.area || current.area > largest.area))) {
          return current
        }
        return largest
      }, null as ProvinceData | null)
      
      const mostPopulous = provinces.reduce((most, current) => {
        if (!most || (current.pop && (!most.pop || current.pop > most.pop))) {
          return current
        }
        return most
      }, null as ProvinceData | null)

      setStats({
        totalProvinces: provinces.length,
        totalPopulation: totalPop,
        totalArea: totalArea,
        totalGDP: totalGDP,
        averageArea: totalArea / validProvinces.length,
        largestProvince: largestByArea,
        mostPopulous: mostPopulous
      })
    }
  }, [provinces])

  if (selectedProvince) {
    return null // Don't show overview when a province is selected
  }

  return (
    <div className="stats-overview">
      <div className="stats-header">
        <h3>📊 Thống kê tổng quan</h3>
        <p>Dữ liệu về các tỉnh thành Việt Nam</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card primary">
          <div className="stat-icon">🏛️</div>
          <div className="stat-content">
            <span className="stat-value">{stats.totalProvinces}</span>
            <span className="stat-title">Tỉnh thành</span>
          </div>
        </div>

        <div className="stat-card success">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <span className="stat-value">
              {stats.totalPopulation > 0 ? `${(stats.totalPopulation / 1000000).toFixed(1)}M` : 'N/A'}
            </span>
            <span className="stat-title">Dân số</span>
          </div>
        </div>

        <div className="stat-card info">
          <div className="stat-icon">📏</div>
          <div className="stat-content">
            <span className="stat-value">
              {stats.totalArea > 0 ? `${(stats.totalArea / 1000).toFixed(0)}K` : 'N/A'}
            </span>
            <span className="stat-title">km² diện tích</span>
          </div>
        </div>

        <div className="stat-card warning">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <span className="stat-value">
              {stats.totalGDP > 0 ? `${(stats.totalGDP / 1000000).toFixed(1)}T` : 'N/A'}
            </span>
            <span className="stat-title">VNĐ GDP</span>
          </div>
        </div>
      </div>

      <div className="highlights">
        <h4>🏆 Điểm nổi bật</h4>
        
        {stats.largestProvince && (
          <div className="highlight-item">
            <span className="highlight-label">Tỉnh lớn nhất:</span>
            <span className="highlight-value">
              {stats.largestProvince.prov_name}
              {stats.largestProvince.area && ` (${stats.largestProvince.area.toLocaleString()} km²)`}
            </span>
          </div>
        )}

        {stats.mostPopulous && (
          <div className="highlight-item">
            <span className="highlight-label">Đông dân nhất:</span>
            <span className="highlight-value">
              {stats.mostPopulous.prov_name}
              {stats.mostPopulous.pop && ` (${stats.mostPopulous.pop.toLocaleString()} người)`}
            </span>
          </div>
        )}

        <div className="highlight-item">
          <span className="highlight-label">Diện tích trung bình:</span>
          <span className="highlight-value">
            {stats.averageArea > 0 ? `${stats.averageArea.toFixed(0)} km²` : 'N/A'}
          </span>
        </div>
      </div>

      <div className="data-note">
        <p>💡 <strong>Lưu ý:</strong> Một số dữ liệu có thể chưa đầy đủ. Click vào bản đồ để xem thông tin chi tiết từng tỉnh thành.</p>
      </div>
    </div>
  )
}

export default StatsOverview
