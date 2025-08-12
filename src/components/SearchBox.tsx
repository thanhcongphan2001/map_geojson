import { useState } from 'react'
import './SearchBox.css'

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

interface SearchBoxProps {
  provinces: ProvinceData[]
  onProvinceSelect: (province: ProvinceData) => void
}

const SearchBox: React.FC<SearchBoxProps> = ({ provinces, onProvinceSelect }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  const filteredProvinces = provinces.filter(province =>
    province.prov_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    province.prov_ne.toLowerCase().includes(searchTerm.toLowerCase()) ||
    province.prov_code.includes(searchTerm)
  )

  const handleSelect = (province: ProvinceData) => {
    onProvinceSelect(province)
    setSearchTerm(province.prov_name)
    setIsOpen(false)
  }

  const handleClear = () => {
    setSearchTerm('')
    setIsOpen(false)
  }

  return (
    <div className="search-box">
      <div className="search-input-container">
        <input
          type="text"
          placeholder="Tìm kiếm tỉnh thành..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          className="search-input"
        />
        
        {searchTerm && (
          <button 
            className="clear-btn"
            onClick={handleClear}
            aria-label="Xóa tìm kiếm"
          >
            ✕
          </button>
        )}
        
        <div className="search-icon">🔍</div>
      </div>

      {isOpen && searchTerm && (
        <div className="search-results">
          {filteredProvinces.length > 0 ? (
            filteredProvinces.slice(0, 8).map((province) => (
              <div
                key={province.id}
                className="search-result-item"
                onClick={() => handleSelect(province)}
              >
                <div className="result-main">
                  <span className="result-name">{province.prov_name}</span>
                  <span className="result-code">#{province.prov_code}</span>
                </div>
                <div className="result-subtitle">{province.prov_fname}</div>
              </div>
            ))
          ) : (
            <div className="no-results">
              <span>Không tìm thấy tỉnh thành nào</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default SearchBox
