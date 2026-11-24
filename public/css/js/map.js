function initListingMap() {
  const mapContainer = document.getElementById("map");
  if (!mapContainer) return;

  const token =
    typeof mapToken !== "undefined" && mapToken
      ? mapToken
      : window.MAP_TOKEN || "";

  const defaultCoords = [79.9865, 14.4426]; // [lng, lat] Nellore, AP
  const validCoords =
    typeof coordinates !== "undefined" &&
    Array.isArray(coordinates) &&
    coordinates.length === 2 &&
    typeof coordinates[0] === "number" &&
    typeof coordinates[1] === "number" &&
    (coordinates[0] !== 0 || coordinates[1] !== 0)
      ? coordinates
      : defaultCoords;

  const popupLabel =
    typeof listingTitle !== "undefined" && listingTitle
      ? listingTitle
      : "Listing Location";

  const renderLeafletMap = (coords) => {
    if (typeof L === "undefined") {
      mapContainer.innerHTML =
        '<div class="alert alert-warning">Map tiles could not be loaded. Check your internet connection.</div>';
      return;
    }

    mapContainer.innerHTML = "";
    const latLng = [coords[1], coords[0]]; // Leaflet expects [lat, lng]
    const leafletMap = L.map("map").setView(latLng, 10);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(leafletMap);

    L.marker(latLng).addTo(leafletMap).bindPopup(popupLabel).openPopup();
  };

  if (typeof mapboxgl !== "undefined" && token) {
    try {
      mapboxgl.accessToken = token;
      const map = new mapboxgl.Map({
        container: "map",
        style: "mapbox://styles/mapbox/streets-v12",
        center: validCoords,
        zoom: 9,
      });

      map.addControl(new mapboxgl.NavigationControl());

      new mapboxgl.Marker({ color: "#fe424d" })
        .setLngLat(validCoords)
        .addTo(map);

      map.on("error", () => {
        try {
          map.remove();
        } catch (_) {}
        renderLeafletMap(validCoords);
      });

      return;
    } catch (_) {
      renderLeafletMap(validCoords);
      return;
    }
  }

  renderLeafletMap(validCoords);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initListingMap);
} else {
  initListingMap();
}