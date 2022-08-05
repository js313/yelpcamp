
mapboxgl.accessToken = mapToken
    const map = new mapboxgl.Map({
        container: 'map', // container ID
        style: 'mapbox://styles/mapbox/streets-v11', // style URL
        center: campground.geometry.coordinates, // starting position [lng, lat]
        zoom: 9 // starting zoom
});
//This is not node.js code that is why we cannot use require or directly assign process.env.MAPBOX_TOKEN to any variable as
//process is not defined. we have to define mapToken in show.ejs

const marker1 = new mapboxgl.Marker()
.setLngLat(campground.geometry.coordinates)
.setPopup(
    new mapboxgl.Popup({ offset: 5 })
    // .setLngLat([-96, 37.8])
    .setHTML(`<h4>${campground.title}</h4><p>${ campground.location }</p>`)  
)
.addTo(map);

map.addControl(new mapboxgl.NavigationControl());
