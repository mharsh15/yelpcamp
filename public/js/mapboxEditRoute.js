// THis handles Map changes in geo json when map form is being updated in update show page of update route

mapboxgl.accessToken = mapboxToken
//console.log(geoLocation)
if (geoLocation.length == 1) {

	geoLocation[0] = 35
	geoLocation[1] = 38
}
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