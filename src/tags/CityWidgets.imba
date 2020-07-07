export tag CityWidgets
	def mount
		let aqiWidgetConfig = [] 
		data.stations.forEach(do |station| aqiWidgetConfig.push({
			container: station.uid,
			city: station.station.url,
			display: "%details"
		}))
		window._aqiFeed(aqiWidgetConfig)

	def render
		<self>
			for station in data.stations
				<a id=station.uid target="_blank" href=("https://aqicn.org/city/" + station.station.url)>

	css 
		w: 96vw
		d: grid
		g: 16px
		gtc: repeat(auto-fit, minmax(200px, 1fr))
		gar: 220px
		gaf: dense
		margin-top: 32px;

	css div
		animation: show_up 300ms ease