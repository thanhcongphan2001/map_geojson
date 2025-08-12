import { useState } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts'
import './ChartModal.css'

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

interface ChartModalProps {
  isOpen: boolean
  onClose: () => void
  province: ProvinceData
  allProvinces: ProvinceData[]
}

const ChartModal: React.FC<ChartModalProps> = ({ isOpen, onClose, province, allProvinces }) => {
  const [activeTab, setActiveTab] = useState<'comparison' | 'ranking' | 'regional'>('comparison')

  if (!isOpen) return null

  // Calculate averages
  const validProvinces = allProvinces.filter(p => p.pop && p.area && p.gdp)
  const avgPop = validProvinces.reduce((sum, p) => sum + (p.pop || 0), 0) / validProvinces.length
  const avgArea = validProvinces.reduce((sum, p) => sum + (p.area || 0), 0) / validProvinces.length
  const avgGDP = validProvinces.reduce((sum, p) => sum + (p.gdp || 0), 0) / validProvinces.length

  // Comparison data
  const comparisonData = [
    {
      metric: 'Dân số (triệu)',
      province: (province.pop || 0) / 1000000,
      average: avgPop / 1000000,
    },
    {
      metric: 'Diện tích (nghìn km²)',
      province: (province.area || 0) / 1000,
      average: avgArea / 1000,
    },
    {
      metric: 'GDP (nghìn tỷ VNĐ)',
      province: (province.gdp || 0) / 1000000,
      average: avgGDP / 1000000,
    }
  ]

  // Top 10 provinces by population
  const topByPopulation = validProvinces
    .sort((a, b) => (b.pop || 0) - (a.pop || 0))
    .slice(0, 10)
    .map(p => ({
      name: p.prov_name,
      value: (p.pop || 0) / 1000000,
      isSelected: p.prov_code === province.prov_code
    }))

  // Regional distribution
  const regionData = validProvinces.reduce((acc, p) => {
    const region = p.region || 'Khác'
    if (!acc[region]) {
      acc[region] = { name: region, population: 0, gdp: 0, count: 0 }
    }
    acc[region].population += p.pop || 0
    acc[region].gdp += p.gdp || 0
    acc[region].count += 1
    return acc
  }, {} as Record<string, any>)

  const regionChartData = Object.values(regionData).map((region: any) => ({
    name: region.name,
    population: region.population / 1000000,
    gdp: region.gdp / 1000000,
    provinces: region.count
  }))

  // Radar chart data for province profile
  const radarData = [
    {
      subject: 'Dân số',
      value: Math.min(((province.pop || 0) / avgPop) * 50, 100),
      fullMark: 100,
    },
    {
      subject: 'Diện tích',
      value: Math.min(((province.area || 0) / avgArea) * 50, 100),
      fullMark: 100,
    },
    {
      subject: 'GDP',
      value: Math.min(((province.gdp || 0) / avgGDP) * 50, 100),
      fullMark: 100,
    },
    {
      subject: 'Mật độ dân số',
      value: province.pop && province.area ? 
        Math.min((province.pop / province.area / 300) * 100, 100) : 0,
      fullMark: 100,
    }
  ]

  const COLORS = ['rgb(59, 216, 255)', '#f39c12', '#e74c3c', '#2ecc71', '#9b59b6', '#34495e']

  return (
    <div className="chart-modal-overlay" onClick={onClose}>
      <div className="chart-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>📊 Biểu đồ thống kê - {province.prov_name}</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="chart-tabs">
          <button 
            className={`tab ${activeTab === 'comparison' ? 'active' : ''}`}
            onClick={() => setActiveTab('comparison')}
          >
            📈 So sánh
          </button>
          <button 
            className={`tab ${activeTab === 'ranking' ? 'active' : ''}`}
            onClick={() => setActiveTab('ranking')}
          >
            🏆 Xếp hạng
          </button>
          <button 
            className={`tab ${activeTab === 'regional' ? 'active' : ''}`}
            onClick={() => setActiveTab('regional')}
          >
            🌍 Vùng miền
          </button>
        </div>

        <div className="chart-content">
          {activeTab === 'comparison' && (
            <div className="chart-section">
              <h3>So sánh với trung bình cả nước</h3>
              <div className="charts-grid">
                <div className="chart-container">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={comparisonData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="metric" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="province" fill="rgb(59, 216, 255)" name={province.prov_name} />
                      <Bar dataKey="average" fill="#95a5a6" name="Trung bình cả nước" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="chart-container">
                  <h4>Hồ sơ tỉnh thành</h4>
                  <ResponsiveContainer width="100%" height={300}>
                    <RadarChart data={radarData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="subject" />
                      <PolarRadiusAxis angle={90} domain={[0, 100]} />
                      <Radar
                        name={province.prov_name}
                        dataKey="value"
                        stroke="rgb(59, 216, 255)"
                        fill="rgb(59, 216, 255)"
                        fillOpacity={0.3}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'ranking' && (
            <div className="chart-section">
              <h3>Top 10 tỉnh thành có dân số cao nhất</h3>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={topByPopulation} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={100} />
                    <Tooltip formatter={(value) => [`${value} triệu người`, 'Dân số']} />
                    <Bar 
                      dataKey="value" 
                      fill={(entry) => entry.isSelected ? '#e74c3c' : 'rgb(59, 216, 255)'}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {activeTab === 'regional' && (
            <div className="chart-section">
              <h3>Phân bố theo vùng miền</h3>
              <div className="charts-grid">
                <div className="chart-container">
                  <h4>Dân số theo vùng</h4>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={regionChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value.toFixed(1)}M`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="population"
                      >
                        {regionChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value} triệu người`, 'Dân số']} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="chart-container">
                  <h4>GDP theo vùng</h4>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={regionChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`${value} nghìn tỷ VNĐ`, 'GDP']} />
                      <Bar dataKey="gdp" fill="#f39c12" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ChartModal
