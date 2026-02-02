import React, { useState, useEffect } from 'react';

// Dữ liệu kho hàng (Hubs)
const HUBS = [
  { id: 'KHO_THU_DUC', label: "Kho Thủ Đức (Hub)", lat: 10.849, lng: 106.772 },
  { id: 'KHO_Q1', label: "Kho Quận 1", lat: 10.776, lng: 106.700 },
  { id: 'KHO_TAN_BINH', label: "Kho Tân Bình", lat: 10.801, lng: 106.655 },
  { id: 'KHO_Q7', label: "Kho Quận 7", lat: 10.732, lng: 106.710 },
  { id: 'KHO_BINH_THANH', label: "Kho Bình Thạnh", lat: 10.810, lng: 106.709 }
];

const ControlPanel = ({ 
  setStartPoint, setEndPoint, onFindPath, 
  routeInfo, shippingCost, isLoading, 
  vehicleType, setVehicleType, endPoint 
}) => {
  
  // State quản lý ô tìm kiếm
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Cập nhật ô input khi EndPoint thay đổi từ bên ngoài (ví dụ click map)
  useEffect(() => {
    if (endPoint) {
      setQuery(endPoint.label);
    }
  }, [endPoint]);

  // Hàm tìm kiếm địa chỉ (Search API)
  useEffect(() => {
    const timeOutId = setTimeout(async () => {
      if (query && query.length > 2 && showSuggestions) {
        try {
          const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=vn&addressdetails=1&limit=5`;
          const res = await fetch(url);
          const data = await res.json();
          setSuggestions(data);
        } catch (err) {
          console.log(err);
        }
      } else {
        setSuggestions([]);
      }
    }, 500); 

    return () => clearTimeout(timeOutId);
  }, [query, showSuggestions]);

  const handleSelectPlace = (place) => {
    setEndPoint({
      lat: parseFloat(place.lat),
      lng: parseFloat(place.lon),
      label: place.display_name,
      id: 'SEARCHED'
    });
    setQuery(place.display_name);
    setShowSuggestions(false); 
  };

  // Styles CSS
  const panelStyle = {
    position: 'absolute', top: '20px', left: '20px', width: '340px',
    zIndex: 1000, backgroundColor: 'white', padding: '20px', borderRadius: '12px',
    boxShadow: '0 8px 24px rgba(0,0,0,0.15)', display: 'flex', flexDirection: 'column', gap: '15px',
    fontFamily: 'Segoe UI, sans-serif'
  };
  const labelStyle = { fontWeight: '600', fontSize: '12px', marginBottom: '5px', color: '#555', textTransform: 'uppercase' };
  const inputStyle = { width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '14px', boxSizing: 'border-box' };

  return (
    <div style={panelStyle}>
      <h3 style={{margin: '0', color: '#1a73e8', textAlign: 'center'}}>🚛 LOGISTICS SYSTEM</h3>
      <hr style={{border: 'none', borderTop: '1px solid #eee', width: '100%', margin: '0'}} />

      {/* 1. Chọn Kho */}
      <div>
        <div style={labelStyle}>Điểm xuất phát (Kho)</div>
        <select style={inputStyle} onChange={(e) => setStartPoint(HUBS.find(l => l.id === e.target.value))}>
          <option value="">-- Chọn kho hàng --</option>
          {HUBS.map(loc => <option key={loc.id} value={loc.id}>{loc.label}</option>)}
        </select>
      </div>

      {/* 2. Tìm kiếm thông minh */}
      <div style={{position: 'relative'}}>
        <div style={labelStyle}>Điểm giao hàng</div>
        <input 
          style={inputStyle} 
          placeholder="🔍 Gõ địa chỉ (VD: Landmark 81)" 
          value={query}
          onChange={(e) => { setQuery(e.target.value); setShowSuggestions(true); }}
          onFocus={() => setShowSuggestions(true)}
        />
        {/* Dropdown gợi ý */}
        {suggestions.length > 0 && showSuggestions && (
          <ul style={{
            position: 'absolute', top: '100%', left: 0, right: 0,
            background: 'white', border: '1px solid #ddd', borderRadius: '0 0 8px 8px',
            listStyle: 'none', padding: 0, margin: 0, maxHeight: '200px', overflowY: 'auto', zIndex: 1001, boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}>
            {suggestions.map((item, idx) => (
              <li 
                key={idx} 
                onClick={() => handleSelectPlace(item)}
                style={{padding: '10px', cursor: 'pointer', borderBottom: '1px solid #f0f0f0', fontSize: '13px'}}
                onMouseEnter={(e) => e.target.style.background = '#f5f5f5'}
                onMouseLeave={(e) => e.target.style.background = 'white'}
              >
                📍 {item.display_name}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 3. Chọn xe */}
      <div>
        <div style={labelStyle}>Loại phương tiện</div>
        <div style={{display: 'flex', gap: '10px'}}>
          <button 
            onClick={() => setVehicleType('truck')}
            style={{flex: 1, padding: '10px', border: vehicleType==='truck'?'2px solid #007bff':'1px solid #ddd', background: vehicleType==='truck'?'#e7f1ff':'white', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold'}}
          >🚚 Xe Tải</button>
          <button 
            onClick={() => setVehicleType('bike')}
            style={{flex: 1, padding: '10px', border: vehicleType==='bike'?'2px solid #007bff':'1px solid #ddd', background: vehicleType==='bike'?'#e7f1ff':'white', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold'}}
          >🛵 Xe Máy</button>
        </div>
      </div>

      {/* 4. Nút bấm */}
      <button 
        onClick={onFindPath} 
        disabled={isLoading}
        style={{
          background: isLoading ? '#ccc' : '#007bff', color: 'white', border: 'none',
          padding: '12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px', marginTop: '5px'
        }}
      >
        {isLoading ? 'ĐANG TÍNH TOÁN...' : 'TÌM ĐƯỜNG & TÍNH CƯỚC'}
      </button>

      {/* 5. Kết quả */}
      {routeInfo && (
        <div style={{marginTop: '10px', padding: '15px', background: '#f8f9fa', borderRadius: '8px', border: '1px dashed #ccc'}}>
          <div style={{display: 'flex', justifyContent: 'space-between'}}><span>Quãng đường:</span> <b>{routeInfo.distance} km</b></div>
          <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '5px'}}><span>Thời gian:</span> <b>{routeInfo.duration} phút</b></div>
          <div style={{borderTop: '1px solid #ddd', margin: '10px 0', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <span style={{fontWeight: 'bold'}}>CHI PHÍ:</span>
            <span style={{color: '#d63384', fontSize: '20px', fontWeight: 'bold'}}>
              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(shippingCost)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ControlPanel;