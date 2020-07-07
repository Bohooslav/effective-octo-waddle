import {Maps} from './tags/Maps'
import {CityWidgets} from './tags/CityWidgets'
import {Logo} from './tags/Logo'
import {State} from './tags/State'

### 
Imba has a revolutionary styling syntax. Think of a pre-processor, mixed with a css utility framework like tailwind, mixed with javascript.
Your styles will be compiled at build time, and there are no un-used styles or classes in your build.
The styles below are applied to the root and the body, and they are in the global scope because they are at the root level of the document.
And by the way, closing declarations with colons is optional.
###
css @root, body
	1radius: 5px
	p:0	m:0
	box-sizing: border-box

###
The <app-root> component is explicitly coded into the body of the public/index.html file.
Any component then placed inside of the app-root component, will be injected into the dom.
As you can see we have a <Logo> component and a <Card> component inside of <self> which is the <app-root> component itself.
The <Logo> component is imported from a custom module found in the src/tags directory. 
The <Card> Component is declared lower in this same document to demonstrate that you can create multiple components in a single document.
You could create your entire app in a single document if you preferred. And components don't need to be created in any particular order.
###

tag app-root
	state = new State

	def mount
		# Before displaying station it will be good to get the list of Ukrainian stations
		let url = "https://api.waqi.info/search/?keyword=Ukraine&token=" + state.token
		let search_res = await loadData url
		state.stations = search_res.data
		console.log state.stations.length
		imba.commit()

	def loadData url
		let res = await window.fetch(url)
		return res.json()

	def render
		<self>
			<a href="http://v2.imba.io" target="_blank"> <Logo>
			<section>
				<h1> "Карти показників якості повітря"
				<Maps bind=state>
			if state.stations.length > 0 then <section>
				<h1> "Показники на українських станціях"
				<CityWidgets bind=state>

	###
	Here we have some scoped CSS. Any css declared within a tag component is scoped to that component.
	The style will not trickle down to elements within nested components. 
	Scoped css will spare you a lot of classes and ID's to style what you want to style.
	And by plaing your styles within your component, it will help you separate concerns by components, rather than by technologies.
	All css properties and values are supported in Imba styles, but the most commonly used ones have a short aliases.
	For example: background-color -> bg, flex-direction -> fld, align-items -> ai, etc. 
	`&` is the selector for the component itself. 
	See if you can tell what styles are being applied.
	###
	css &
		display: flex
		fld: column  
		ai:center
		ta:center
		bg:gray9 
		color: purple1
		ff: Helvetica Neue, Arial, Noto Sans, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji
		min-height: 100vh
		pb: 10vw

	css h1
		text-align: left
		text-indent: 0.5em