import { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
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

    return {
      fillColor: isHovered ? "#ff6b6b" : "rgb(59, 216, 255)",
      weight: isHovered ? 3 : 2,
      opacity: 1,
      color: isHovered ? "#2c3e50" : "#34495e",
      dashArray: "",
      fillOpacity: isHovered ? 0.8 : 0.6,
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

        // Show tooltip
        L.popup()
          .setLatLng(e.latlng)
          .setContent(
            `
            <div class="province-tooltip">
              <h3>${provinceData.prov_name}</h3>
              <p><strong>Mã tỉnh:</strong> ${provinceData.prov_code}</p>
              <p><em>Click để xem chi tiết</em></p>
            </div>
          `
          )
          .openOn(e.target._map);
      },

      mouseout: (e) => {
        setHoveredProvince(null);
        const layer = e.target;
        layer.setStyle(getProvinceStyle(feature));
        e.target._map.closePopup();
      },

      click: (e) => {
        onProvinceSelect(provinceData);

        // Zoom to province bounds
        const layer = e.target;
        const map = layer._map;
        map.fitBounds(layer.getBounds(), {
          padding: [20, 20],
          maxZoom: 10,
        });
      },
    });

    // Bind permanent tooltip for province name
    layer.bindTooltip(provinceData.prov_name, {
      permanent: false,
      direction: "center",
      className: "province-label",
    });
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
    onProvinceSelect(province);

    // Find the province in GeoJSON and zoom to it
    if (geoJsonData && mapRef.current) {
      const feature = geoJsonData.features.find(
        (f: any) => f.properties.prov_code === province.prov_code
      );

      if (feature) {
        const bounds = L.geoJSON(feature).getBounds();
        mapRef.current.fitBounds(bounds, {
          padding: [20, 20],
          maxZoom: 10,
        });
      }
    }
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
        style={{ height: "100%", width: "100%" }}
        className="leaflet-map"
        ref={mapRef}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          subdomains="abcd"
        />

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
            onProvinceSelect(null);
            if (mapRef.current) {
              mapRef.current.setView(vietnamCenter, 6);
            }
          }}
        >
          🏠 Về tổng quan
        </button>
      </div>
    </div>
  );
};

export default MapComponent;
