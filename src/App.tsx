import { useState } from "react";
import MapComponent from "./components/MapComponent";
import ProvinceInfo from "./components/ProvinceInfo";
import "./App.css";

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

function App() {
  const [selectedProvince, setSelectedProvince] = useState<ProvinceData | null>(
    null
  );

  return (
    <div className="app">
      <header className="app-header">
        <h1>🗺️ GTEL MAPS - Bản đồ Việt Nam</h1>
        <p>Khám phá các tỉnh thành trên bản đồ tương tác</p>
      </header>

      <main className="app-main">
        <div className="map-container">
          <MapComponent onProvinceSelect={setSelectedProvince} />
        </div>

        <div className="info-panel">
          <ProvinceInfo province={selectedProvince} />
        </div>
      </main>
    </div>
  );
}

export default App;
