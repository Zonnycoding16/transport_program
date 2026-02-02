import { useState } from 'react';
import './App.css';
import ControlPanel from './components/ControlPanel';
import MapDisplay from './components/MapDisplay';

function App() {
  const [startPoint, setStartPoint] = useState(null);
  const [endPoint, setEndPoint] = useState(null);
  const [routeCoords, setRouteCoords] = useState([]);
  const [routeInfo, setRouteInfo] = useState(null);
  const [shippingCost, setShippingCost] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [vehicleType, setVehicleType] = useState('truck');

  // --- CẤU HÌNH GIÁ CƯỚC (Business Logic) ---
  const PRICING_MATRIX = {
    truck: { 
      apiMode: 'driving', 
      basePrice: 15000,   // Phí mở cửa 15k
      pricePerKm: 12000   // 12k/km
    },
    bike: { 
      apiMode: 'cycling', // Chế độ xe máy (dùng cycling để đi đường nhỏ được)
      basePrice: 5000,    // Phí mở cửa 5k
      pricePerKm: 4500    // 4.5k/km
    }
  };

  // --- XỬ LÝ KHI CLICK BẢN ĐỒ (Reverse Geocoding) ---
  const handleMapClick = async (latlng) => {
    // 1. Cập nhật ngay tọa độ để Map hiện Marker liền (cho mượt)
    const tempPoint = { 
      lat: latlng.lat, 
      lng: latlng.lng, 
      label: "Đang dò địa chỉ...", 
      id: 'CLICKED_LOC' 
    };
    setEndPoint(tempPoint);

    // 2. Gọi API để dịch tọa độ sang tên đường
    try {
      const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latlng.lat}&lon=${latlng.lng}&zoom=18&addressdetails=1`;
      const res = await fetch(url);
      const data = await res.json();
      
      if (data && data.display_name) {
        // Lấy tên ngắn gọn hơn (chỉ lấy phần đầu tiên của địa chỉ)
        const shortName = data.display_name.split(',')[0]; 
        setEndPoint({
          ...tempPoint,
          label: shortName + " (Đã chọn trên Map)"
        });
      }
    } catch (error) {
      console.error("Lỗi lấy tên đường:", error);
      setEndPoint({ ...tempPoint, label: `Vị trí: ${latlng.lat.toFixed(4)}, ${latlng.lng.toFixed(4)}` });
    }
  };

  // --- XỬ LÝ TÌM ĐƯỜNG & TÍNH TIỀN ---
  const handleFindPath = async () => {
    if (!startPoint || !endPoint) {
      alert("Vui lòng chọn đủ Điểm Gửi và Điểm Nhận!");
      return;
    }

    setIsLoading(true);
    const mode = PRICING_MATRIX[vehicleType].apiMode;
    const url = `https://router.project-osrm.org/route/v1/${mode}/${startPoint.lng},${startPoint.lat};${endPoint.lng},${endPoint.lat}?overview=full&geometries=geojson`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.code === 'Ok') {
        const route = data.routes[0];
        const distKm = route.distance / 1000;
        
        // Tính tiền
        const config = PRICING_MATRIX[vehicleType];
        const totalCost = config.basePrice + (distKm * config.pricePerKm);
        
        setShippingCost(totalCost);
        setRouteInfo({
          distance: distKm.toFixed(2),
          duration: (route.duration / 60).toFixed(0)
        });

        // Vẽ đường (Leaflet cần lat,lng còn OSRM trả về lng,lat nên phải đảo ngược)
        const coords = route.geometry.coordinates.map(c => [c[1], c[0]]);
        setRouteCoords(coords);
      } else {
        alert("Không tìm thấy đường đi!");
      }
    } catch (error) {
      console.error("Lỗi:", error);
      alert("Lỗi kết nối server bản đồ.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="App">
      <ControlPanel 
        setStartPoint={setStartPoint} 
        setEndPoint={setEndPoint}
        onFindPath={handleFindPath}
        routeInfo={routeInfo}
        shippingCost={shippingCost}
        isLoading={isLoading}
        vehicleType={vehicleType}
        setVehicleType={setVehicleType}
        endPoint={endPoint} // Truyền xuống để ô tìm kiếm tự cập nhật khi click map
      />
      
      <div className="map-container">
        <MapDisplay 
          startPoint={startPoint} 
          endPoint={endPoint}
          routeCoords={routeCoords}
          onMapClick={handleMapClick}
        />
      </div>
    </div>
  );
}

export default App;