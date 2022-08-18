
// this handels mapbox for individual camp route route
//mapboxgl.accessToken = "pk.eyJ1IjoiemVzdGVyc2NobWlkMTYiLCJhIjoiY2t6NmV2cGdvMGJqaDJ1bWdmeWUxMDRncCJ9.mVpA4NiHqBTt2XBkHThZow"
mapboxgl.accessToken = mapboxToken

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

marker
	.setLngLat(geoLocation)
	.setPopup(
		new mapboxgl.Popup()
			.setHTML(`<h3>${campTitle}</h3>`)
	)
	.addTo(map)
