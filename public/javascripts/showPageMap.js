mapboxgl.accessToken = 'pk.eyJ1IjoicmItcmIiLCJhIjoiY2tsZGRxOTN1MW9zYzJvbGJ3amkyeTBhbiJ9.ovqwNtyzXssv9PohyDTGng';
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/navigation-guidance-night-v4', // style URL
    center: campground.geometry.coordinates, // starting position [lng, lat]
    zoom: 11 // starting zoom
});

new mapboxgl.Marker()
    .setLngLat(campground.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({offset : 25})
        .setHTML(
            `<h5>${campground.title}</h5><p>${campground.location}</p>`
        )
    )
    .addTo(map)