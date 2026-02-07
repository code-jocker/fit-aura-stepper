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

export default function DeliveryMap({ orders = [], workers = [], onMarkerClick }) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || "your-google-maps-api-key-here"
  });

  const [selectedItem, setSelectedItem] = React.useState(null); // { type: 'order' | 'worker', data: any }

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={12}
    >
      {/* Order Markers */}
      {orders.filter(order => order.location && order.location.lat).map(order => (
        <Marker
          key={order._id}
          position={{ lat: order.location.lat, lng: order.location.lng }}
          onClick={() => setSelectedItem({ type: 'order', data: order })}
          icon={{
            url: order.status === 'delivered' 
              ? 'http://maps.google.com/mapfiles/ms/icons/green-dot.png' 
              : order.status === 'shipped' 
                ? 'http://maps.google.com/mapfiles/ms/icons/orange-dot.png'
                : 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
            scaledSize: new window.google.maps.Size(40, 40)
          }}
          title={order.customerName}
        />
      ))}

      {/* Worker Markers */}
      {workers.filter(worker => worker.currentLocation && worker.currentLocation.lat).map(worker => (
        <Marker
          key={worker._id}
          position={{ lat: worker.currentLocation.lat, lng: worker.currentLocation.lng }}
          onClick={() => setSelectedItem({ type: 'worker', data: worker })}
          icon={{
            url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
            scaledSize: new window.google.maps.Size(45, 45)
          }}
          title={worker.name}
        />
      ))}

      {selectedItem && (
        <InfoWindow
          position={
            selectedItem.type === 'order' 
              ? { lat: selectedItem.data.location.lat, lng: selectedItem.data.location.lng }
              : { lat: selectedItem.data.currentLocation.lat, lng: selectedItem.data.currentLocation.lng }
          }
          onCloseClick={() => setSelectedItem(null)}
        >
          <div className="p-3 min-w-[220px]">
            {selectedItem.type === 'order' ? (
              <>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">📦</span>
                  <h3 className="font-black uppercase text-sm">{selectedItem.data.customerName}</h3>
                </div>
                <p className="text-xs text-gray-600 mb-3 font-medium">{selectedItem.data.deliveryAddress}</p>
                <div className="flex justify-between items-center border-t pt-2">
                  <span className={`text-[10px] px-2 py-1 rounded-full uppercase font-black ${
                    selectedItem.data.status === 'delivered' ? 'bg-green-100 text-green-700' : 
                    selectedItem.data.status === 'shipped' ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {selectedItem.data.status}
                  </span>
                  <button 
                    onClick={() => onMarkerClick && onMarkerClick({ type: 'order', data: selectedItem.data })}
                    className="text-[10px] bg-black text-white px-3 py-1.5 rounded-lg font-black uppercase tracking-widest hover:bg-amber-500 transition-all"
                  >
                    Details
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">🚴</span>
                  <h3 className="font-black uppercase text-sm">{selectedItem.data.name}</h3>
                </div>
                <p className="text-xs text-gray-600 mb-1 font-medium">Status: 
                  <span className={selectedItem.data.isAvailable ? "text-green-600 ml-1" : "text-red-600 ml-1"}>
                    {selectedItem.data.isAvailable ? "Available" : "Busy/Offline"}
                  </span>
                </p>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{selectedItem.data.phone}</p>
                <div className="mt-3 pt-2 border-t text-center">
                  <button 
                    className="text-[10px] text-amber-600 font-black uppercase tracking-widest hover:text-black transition-colors"
                    onClick={() => window.location.href = `tel:${selectedItem.data.phone}`}
                  >
                    Call Worker
                  </button>
                </div>
              </>
            )}
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  ) : <div className="h-[500px] w-full bg-gray-100 animate-pulse rounded-[1.5rem] flex items-center justify-center font-bold text-gray-400 uppercase tracking-widest">Loading Live Maps...</div>;
}
