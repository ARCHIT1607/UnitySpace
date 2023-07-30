import React from "react";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import { useState } from "react";
import { useEffect } from "react";
import { useMemo } from "react";
import './MapContainer.css';
const MapContainer = (props) => {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyCBHQ2PytqvWuk1RcoWshj57oxZf12l9yM",
  });


  const [userLocation, setUserLocation] = useState(null);
  useEffect(() => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setUserLocation({ lat: latitude, lng: longitude });
          },
          (error) => {
            console.log(error);
          }
        );
      }
  }, []);
  const center = useMemo(() => (userLocation), []);
  const mapStyles = {
    width: "100%",
    height: "400px",
  };

  return (
    <GoogleMap zoom={10} center={center} mapContainerClassName="map-container">
    <Marker position={center} />
  </GoogleMap>
  );
};

export default MapContainer
