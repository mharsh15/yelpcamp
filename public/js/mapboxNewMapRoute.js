// THis JS file is used when a new camp is being added
//mapboxgl.accessToken = "pk.eyJ1IjoiemVzdGVyc2NobWlkMTYiLCJhIjoiY2t6NmV2cGdvMGJqaDJ1bWdmeWUxMDRncCJ9.mVpA4NiHqBTt2XBkHThZow"
mapboxgl.accessToken = mapboxToken
//console.log(geoLocation)
var geoLocation = [35.463652, 38.555950]
const map = new mapboxgl.Map(
	{
		container: 'map', // container ID
		style: 'mapbox://styles/mapbox/streets-v11', // style URL
		center: geoLocation, // starting position [lng, lat]
		zoom: 9 // starting zoom
	});
map.addControl(new mapboxgl.NavigationControl())
// for adding pin marker 
const marker = new mapboxgl.Marker()
	.setLngLat(geoLocation)
	.addTo(map)
//creating query selector
const longitudeTag = document.getElementById("longitude");
const latitudeTag = document.getElementById("latitude");
setLocation(geoLocation[0], geoLocation[1])
marker
	.setLngLat(geoLocation)
	.addTo(map)
//when mouse moves
map.on('click', (e) => {
	console.log(e)
	console.log(e.lngLat.lng)
	geoLocation = [e.lngLat.lng, e.lngLat.lat]
	marker
		.setLngLat(geoLocation)
		.addTo(map)
	setLocation(geoLocation[0], geoLocation[1])

	// `e.point` is the x, y coordinates of the `mousemove` event
	// relative to the top-left corner of the map.

});

function setLocation(longitude, latitude) {
	//console.log(longitudeTag)
	longitudeTag.value = longitude
	latitudeTag.value = latitude
}