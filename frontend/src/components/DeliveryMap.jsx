import React, { useEffect, useState } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow, DirectionsRenderer } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '600px',
  borderRadius: '2rem'
};

const center = {
  lat: -1.9441, // Kigali center
  lng: 30.0619
};

// Fit Aura Steppers HQ (Store Location)
const STORE_LOCATION = {
  lat: -1.9441,
  lng: 30.0619
};

export default function DeliveryMap({ orders, onMarkerClick }) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || ""
  });

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [directions, setDirections] = useState(null);

  useEffect(() => {
    if (isLoaded && selectedOrder && selectedOrder.location) {
      const directionsService = new window.google.maps.DirectionsService();
      directionsService.route(
        {
          origin: STORE_LOCATION,
          destination: { lat: selectedOrder.location.lat, lng: selectedOrder.location.lng },
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK) {
            setDirections(result);
          } else {
            console.error(`error fetching directions ${result}`);
          }
        }
      );
    } else {
      setDirections(null);
    }
  }, [isLoaded, selectedOrder]);

  return isLoaded ? (
    <div className="relative">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={13}
        options={{
          styles: [
            {
              "featureType": "all",
              "elementType": "labels.text.fill",
              "stylers": [{ "color": "#000000" }]
            }
          ]
        }}
      >
        {/* Store Marker */}
        <Marker
          position={STORE_LOCATION}
          icon={{
            url: 'https://cdn-icons-png.flaticon.com/512/619/619153.png',
            scaledSize: new window.google.maps.Size(40, 40)
          }}
          title="Fit Aura Steppers HQ"
        />

        {orders.filter(order => order.location && order.location.lat).map(order => (
          <Marker
            key={order._id}
            position={{ lat: order.location.lat, lng: order.location.lng }}
            onClick={() => setSelectedOrder(order)}
            icon={{
              url: order.status === 'delivered' 
                ? 'http://maps.google.com/mapfiles/ms/icons/green-dot.png' 
                : order._id === selectedOrder?._id 
                  ? 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
                  : 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
            }}
          />
        ))}

        {directions && (
          <DirectionsRenderer
            directions={directions}
            options={{
              suppressMarkers: true,
              polylineOptions: {
                strokeColor: "#F59E0B",
                strokeWeight: 5,
                strokeOpacity: 0.8
              }
            }}
          />
        )}

        {selectedOrder && (
          <InfoWindow
            position={{ lat: selectedOrder.location.lat, lng: selectedOrder.location.lng }}
            onCloseClick={() => setSelectedOrder(null)}
          >
            <div className="p-3 min-w-[220px]">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center text-xs">👤</div>
                <div>
                  <h3 className="font-black text-sm uppercase tracking-tight">{selectedOrder.customerName}</h3>
                  <p className="text-[10px] text-gray-400 font-bold">{selectedOrder.phone}</p>
                </div>
              </div>
              
              <p className="text-[11px] text-gray-600 mb-3 leading-tight border-l-2 border-amber-500 pl-2">
                {selectedOrder.deliveryAddress}
              </p>

              {directions && directions.routes[0] && (
                <div className="bg-gray-50 p-2 rounded-xl mb-3 flex justify-between items-center border border-gray-100">
                  <div className="text-center flex-1">
                    <p className="text-[9px] text-gray-400 uppercase font-black">Distance</p>
                    <p className="text-xs font-black text-black">{directions.routes[0].legs[0].distance.text}</p>
                  </div>
                  <div className="w-px h-4 bg-gray-200"></div>
                  <div className="text-center flex-1">
                    <p className="text-[9px] text-gray-400 uppercase font-black">Time</p>
                    <p className="text-xs font-black text-black">{directions.routes[0].legs[0].duration.text}</p>
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center gap-2">
                <span className={`text-[9px] px-2 py-1 rounded-lg uppercase font-black ${
                  selectedOrder.status === 'delivered' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                }`}>
                  {selectedOrder.status}
                </span>
                <button 
                  onClick={() => onMarkerClick(selectedOrder)}
                  className="flex-1 text-[10px] bg-black text-white px-3 py-2 rounded-lg font-black uppercase tracking-widest hover:bg-amber-500 transition-all shadow-lg shadow-black/10"
                >
                  Manage Order
                </button>
              </div>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
      
      {/* Map Legend Overlay */}
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm p-3 rounded-2xl shadow-xl border border-white/20 pointer-events-none">
        <h4 className="text-[10px] font-black uppercase tracking-widest mb-2 border-b border-gray-100 pb-1">Fleet Tracker</h4>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500"></div>
            <span className="text-[9px] font-bold uppercase">Pending Delivery</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span className="text-[9px] font-bold uppercase">Delivered</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-amber-500"></div>
            <span className="text-[9px] font-bold uppercase">Live Route</span>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="h-[600px] w-full bg-gray-100 animate-pulse rounded-[2rem] flex flex-col items-center justify-center gap-4">
      <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
      <span className="font-black text-gray-400 uppercase tracking-[0.2em] text-sm">Initializing Fleet Map...</span>
    </div>
  );
}
