import React from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '500px',
  borderRadius: '1.5rem'
};

const center = {
  lat: -1.9441, // Kigali center
  lng: 30.0619
};

export default function DeliveryMap({ orders, onMarkerClick }) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "your-google-maps-api-key-here"
  });

  const [selectedOrder, setSelectedOrder] = React.useState(null);

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={12}
    >
      {orders.filter(order => order.location && order.location.lat).map(order => (
        <Marker
          key={order._id}
          position={{ lat: order.location.lat, lng: order.location.lng }}
          onClick={() => setSelectedOrder(order)}
          icon={{
            url: order.status === 'delivered' ? 'http://maps.google.com/mapfiles/ms/icons/green-dot.png' : 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
          }}
        />
      ))}

      {selectedOrder && (
        <InfoWindow
          position={{ lat: selectedOrder.location.lat, lng: selectedOrder.location.lng }}
          onCloseClick={() => setSelectedOrder(null)}
        >
          <div className="p-2 min-w-[200px]">
            <h3 className="font-bold text-sm mb-1">{selectedOrder.customerName}</h3>
            <p className="text-xs text-gray-600 mb-2">{selectedOrder.deliveryAddress}</p>
            <div className="flex justify-between items-center">
              <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase font-black ${
                selectedOrder.status === 'delivered' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
              }`}>
                {selectedOrder.status}
              </span>
              <button 
                onClick={() => onMarkerClick(selectedOrder)}
                className="text-[10px] bg-black text-white px-2 py-1 rounded font-bold uppercase tracking-widest hover:bg-amber-500 transition-colors"
              >
                View Details
              </button>
            </div>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  ) : <div className="h-[500px] w-full bg-gray-100 animate-pulse rounded-[1.5rem] flex items-center justify-center font-bold text-gray-400 uppercase tracking-widest">Loading Maps...</div>;
}
