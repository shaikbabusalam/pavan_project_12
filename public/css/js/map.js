if (typeof mapboxgl !== "undefined" && typeof mapToken !== "undefined" && mapToken) {
  mapboxgl.accessToken = mapToken;

  const validCoords =
    Array.isArray(coordinates) &&
    coordinates.length === 2 &&
    (coordinates[0] !== 0 || coordinates[1] !== 0)
      ? coordinates
      : [79.9865, 14.4426];

  const map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/streets-v12",
    center: validCoords,
    zoom: 9,
  });

  new mapboxgl.Marker({ color: "#fe424d" })
    .setLngLat(validCoords)
    .addTo(map);
}