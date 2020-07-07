export tag Maps
	
	def mount
		const OSM_URL  =  'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
		const OSM_ATTRIB  =  '&copy;  <a  href="http://openstreetmap.org/copyright">OpenStreetMap</a>  contributors'
		let maps = []

		for aqi in data.aqis
			const osmLayer  =  L.tileLayer(OSM_URL,  {attribution:  OSM_ATTRIB})
			const WAQI_ATTR  =  'Air  Quality  Tiles  &copy;  <a  href="http://waqi.info">waqi.info</a>'
			let WAQI_URL    =  'https://tiles.waqi.info/tiles/' + aqi.id + '/{z}/{x}/{y}.png?token=' + data['token']

			let waqiLayer  =  L.tileLayer(WAQI_URL,  {attribution:  WAQI_ATTR})
			let map  =  L.map(aqi.id).setView([48.2,  31.3], 5)
			map.addLayer(osmLayer).addLayer(waqiLayer)
			maps.push(map)

		let i = 0
		while i < maps.length
			let j = 0
			while j < maps.length
				unless i == j
					maps[i].sync(maps[j])
				j++
			i++

	def render
		<self>
			for aqi in data.aqis
				<.mapbox>
					<h2> aqi.name
					<.map#{aqi.id}>

	css
		bg: purple9
		color: purple2
		p: 16px
		radius: 12px

	css .mapbox
		d: flex
		fld: column

	css .mapbox > div
		h: calc(320px + 0)
		radius: 8px
	
	css	
		w: 96vw
		d: grid
		g: 16px
		gtc: repeat(auto-fit, minmax(420px, 1fr))
		gar: 340px
		mb: 8vh
