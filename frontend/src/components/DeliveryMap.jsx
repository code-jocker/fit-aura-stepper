import React, { useEffect, useState, useRef } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow, DirectionsRenderer, Autocomplete } from '@react-google-maps/api';

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

const libraries = ["places"];

export default function DeliveryMap({ orders, onMarkerClick, onStatusUpdate }) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || "",
    libraries: libraries
  });

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [directions, setDirections] = useState(null);
  const [map, setMap] = useState(null);
  const [searchBox, setSearchBox] = useState(null); // eslint-disable-line no-unused-vars
  const autocompleteRef = useRef(null);

  const onLoad = React.useCallback(function callback(map) {
    setMap(map);
  }, []);

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null);
  }, []);

  const onPlaceChanged = () => {
    if (autocompleteRef.current !== null) {
      const place = autocompleteRef.current.getPlace();
      if (place.geometry && place.geometry.location) {
        const newPos = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng()
        };
        map.panTo(newPos);
        map.setZoom(15);
      }
    }
  };

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
      {/* Search Box Overlay */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 w-[90%] max-w-md">
        <Autocomplete
          onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
          onPlaceChanged={onPlaceChanged}
        >
          <div className="relative group">
            <input
              type="text"
              placeholder="Search delivery location..."
              className="w-full bg-white/95 backdrop-blur-md px-12 py-4 rounded-2xl shadow-2xl border border-white/20 outline-none focus:ring-4 ring-amber-500/20 font-bold transition-all text-sm"
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl">🔍</span>
            <div className="absolute right-2 top-1/2 -translate-y-1/2 bg-black text-white px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest opacity-0 group-focus-within:opacity-100 transition-opacity">
              Find
            </div>
          </div>
        </Autocomplete>
      </div>

      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={13}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={{
          styles: [
            {
              "featureType": "all",
              "elementType": "labels.text.fill",
              "stylers": [{ "color": "#000000" }]
            }
          ],
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false
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

              <div className="space-y-2">
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
                    Details
                  </button>
                </div>
                
                {selectedOrder.status !== 'delivered' && onStatusUpdate && (
                  <button 
                    onClick={() => {
                      onStatusUpdate(selectedOrder._id, 'delivered');
                      setSelectedOrder(null);
                    }}
                    className="w-full text-[10px] bg-green-500 text-white px-3 py-2 rounded-lg font-black uppercase tracking-widest hover:bg-green-600 transition-all shadow-lg shadow-green-500/20"
                  >
                    Mark as Delivered
                  </button>
                )}
              </div>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
      
      {/* Map Legend Overlay */}
      <div className="absolute bottom-8 left-4 bg-white/90 backdrop-blur-sm p-4 rounded-2xl shadow-2xl border border-white/20 pointer-events-none">
        <h4 className="text-[10px] font-black uppercase tracking-widest mb-3 border-b border-gray-100 pb-2">Fleet Tracker</h4>
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-red-500 shadow-lg shadow-red-500/20"></div>
            <span className="text-[9px] font-black uppercase text-gray-600">Pending Delivery</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-green-500 shadow-lg shadow-green-500/20"></div>
            <span className="text-[9px] font-black uppercase text-gray-600">Delivered</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-amber-500 shadow-lg shadow-amber-500/20"></div>
            <span className="text-[9px] font-black uppercase text-gray-600">Live Route</span>
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
