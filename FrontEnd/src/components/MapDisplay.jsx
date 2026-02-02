import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// --- Fix lỗi mất icon mặc định của Leaflet ---
import iconMarker from 'leaflet/dist/images/marker-icon.png';
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: iconRetina,
  iconUrl: iconMarker,
  shadowUrl: iconShadow,
});

// Component con: Bắt sự kiện Click trên bản đồ
function LocationPicker({ onMapClick }) {
  useMapEvents({
    click(e) {
      // Gọi hàm từ App.jsx để xử lý
      onMapClick(e.latlng);
    },
  });
  return null;
}

// Component con: Tự động zoom bản đồ bao trọn lộ trình
function AutoZoom({ bounds }) {
  const map = useMap();
  useEffect(() => {
    if (bounds) map.fitBounds(bounds, { padding: [50, 50] });
  }, [bounds, map]);
  return null;
}

const MapDisplay = ({ startPoint, endPoint, routeCoords, onMapClick }) => {
  // Tính toán vùng hiển thị
  let bounds = null;
  if (startPoint && endPoint) {
    bounds = L.latLngBounds([startPoint.lat, startPoint.lng], [endPoint.lat, endPoint.lng]);
  }

  return (
    <MapContainer center={[10.776, 106.700]} zoom={12} scrollWheelZoom={true} style={{height: '100%', width: '100%'}}>
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Kích hoạt click */}
      <LocationPicker onMapClick={onMapClick} />

      {startPoint && (
        <Marker position={[startPoint.lat, startPoint.lng]}>
          <Popup><b>Kho:</b> {startPoint.label}</Popup>
        </Marker>
      )}

      {endPoint && (
        <Marker position={[endPoint.lat, endPoint.lng]}>
          <Popup><b>Giao tại:</b> {endPoint.label}</Popup>
        </Marker>
      )}

      {routeCoords.length > 0 && (
        <Polyline positions={routeCoords} color="#007bff" weight={6} opacity={0.8} />
      )}

      <AutoZoom bounds={bounds} />
    </MapContainer>
  );
};

export default MapDisplay;