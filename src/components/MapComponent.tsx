import { useEffect, useState, useRef } from "react";
import { MapContainer, GeoJSON, AttributionControl } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import SearchBox from "./SearchBox";
import "./MapComponent.css";

// Fix for default markers in React-Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

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

interface MapComponentProps {
  onProvinceSelect: (province: ProvinceData | null) => void;
}

const MapComponent: React.FC<MapComponentProps> = ({ onProvinceSelect }) => {
  const [geoJsonData, setGeoJsonData] = useState<any>(null);
  const [hoveredProvince, setHoveredProvince] = useState<string | null>(null);
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
  const [provinces, setProvinces] = useState<ProvinceData[]>([]);
  const mapRef = useRef<L.Map | null>(null);

  // Load GeoJSON data
  useEffect(() => {
    const loadGeoJsonData = async () => {
      try {
        const response = await fetch("/provinces_pg_v2_smooth.geojson");
        const data = await response.json();
        setGeoJsonData(data);

        // Extract provinces data for search
        if (data.features) {
          const provincesData = data.features.map(
            (feature: any) => feature.properties
          );
          setProvinces(provincesData);
        }
      } catch (error) {
        console.error("Error loading GeoJSON data:", error);
      }
    };

    loadGeoJsonData();
  }, []);

  // Style function for provinces
  const getProvinceStyle = (feature: any) => {
    const isHovered = hoveredProvince === feature.properties.prov_code;
    const isSelected = selectedProvince === feature.properties.prov_code;

    // Priority: Selected > Hovered > Default
    if (isSelected) {
      return {
        fillColor: "#e74c3c", // Màu đỏ cho tỉnh được chọn
        weight: 1,
        opacity: 1,
        color: "#c0392b", // Viền đỏ đậm
        dashArray: "",
        fillOpacity: 0.9,
      };
    }

    if (isHovered) {
      return {
        fillColor: "#22c55e", // Màu xanh lá cây cho hover
        weight: 1,
        opacity: 1,
        color: "#16a34a", // Viền xanh lá đậm hơn
        dashArray: "",
        fillOpacity: 0.8,
      };
    }

    // Default style
    return {
      fillColor: "#3bd8ff", // Màu trắng trong suốt
      weight: 0.5,
      opacity: 1,
      color: "#374151", // Xám đậm - trung tính, chuyên nghiệp// Viền xanh đậm phù hợp với background
      dashArray: "",
      fillOpacity: 0.8,
    };
  };

  // Event handlers for province interactions
  const onEachFeature = (feature: any, layer: L.Layer) => {
    const provinceData: ProvinceData = feature.properties;

    layer.on({
      mouseover: (e) => {
        setHoveredProvince(provinceData.prov_code);
        const layer = e.target;
        layer.setStyle({
          weight: 3,
          color: "#2c3e50",
          dashArray: "",
          fillOpacity: 0.8,
          fillColor: "rgb(255, 107, 107)",
        });

        // No popup on hover - we have tooltip instead
      },

      mouseout: (e) => {
        setHoveredProvince(null);
        const layer = e.target;
        layer.setStyle(getProvinceStyle(feature));
      },

      click: (e) => {
        // Set selected province for highlighting
        setSelectedProvince(provinceData.prov_code);
        onProvinceSelect(provinceData);

        // No zoom - keep map fixed
      },
    });

    // No tooltip - we have info panel instead
  };

  // Vietnam center coordinates
  const vietnamCenter: [number, number] = [16.0583, 108.2772];

  if (!geoJsonData) {
    return (
      <div className="map-loading">
        <div className="loading-spinner"></div>
        <p>Đang tải bản đồ...</p>
      </div>
    );
  }

  const handleSearchSelect = (province: ProvinceData) => {
    setSelectedProvince(province.prov_code); // Set selected province for highlighting
    onProvinceSelect(province);

    // No zoom - keep map fixed
  };

  return (
    <div className="map-wrapper">
      <div className="map-search">
        <SearchBox
          provinces={provinces}
          onProvinceSelect={handleSearchSelect}
        />
      </div>

      <MapContainer
        center={vietnamCenter}
        zoom={6}
        minZoom={6}
        maxZoom={6}
        style={{ height: "100%", width: "100%" }}
        className="leaflet-map"
        ref={mapRef}
        zoomControl={false}
        attributionControl={false}
        scrollWheelZoom={false}
        doubleClickZoom={false}
        touchZoom={false}
        dragging={false}
        boxZoom={false}
        keyboard={false}
        zoomSnap={0}
        zoomDelta={0}
      >
        <AttributionControl position="bottomright" prefix="" />

        <GeoJSON
          data={geoJsonData}
          style={getProvinceStyle}
          onEachFeature={onEachFeature}
        />
      </MapContainer>

      <div className="map-controls">
        <button
          className="reset-view-btn"
          onClick={() => {
            setSelectedProvince(null); // Reset selected province
            onProvinceSelect(null);
            // No view change - keep map fixed
          }}
        >
          🏠 Về tổng quan
        </button>
      </div>
    </div>
  );
};

export default MapComponent;
