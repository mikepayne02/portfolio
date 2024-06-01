<script lang="ts">
	import maplibregl from 'maplibre-gl'
	export let latitude: number
	export let longitude: number
	export let zoom: number = 6
	export let mapStyle: string
	export let interactive: boolean = true
	import { onMount } from 'svelte'

	onMount(() => {
		new maplibregl.Map({
			container: 'map', // container id
			style: mapStyle,
			center: [longitude, latitude],
			zoom,
			interactive
		})
	})
</script>

<div id="map" class={$$props.class}></div>
