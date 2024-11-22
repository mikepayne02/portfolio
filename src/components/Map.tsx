import { useRef, useEffect } from 'react'
import { ArcLayer } from '@deck.gl/layers'
import { MapboxOverlay } from '@deck.gl/mapbox'
import 'maplibre-gl/dist/maplibre-gl.css'
import maplibre from 'maplibre-gl'
import '@/styles/map.css'

const { Map } = maplibre

import { MAPTILER_API_KEY, MAP_DATA } from 'astro:env/client'

interface MapProps {
  latitude: number
  longitude: number
  zoom: number
  pitch: number
  interactive: boolean
}

function getStyle(theme: string): string {
  return `https://api.maptiler.com/maps/dataviz-${theme}/style.json?key=${MAPTILER_API_KEY}`
}

export default (props: MapProps) => {
  const mapContainer = useRef(null)
  const map = useRef<maplibregl.Map | null>(null)

  useEffect(() => {
    if (map.current) return

    const rootInDarkMode = document.documentElement.classList.contains('dark')

    map.current = new Map({
      container: mapContainer.current ?? '',
      interactive: props.interactive,
      center: [props.longitude, props.latitude],
      zoom: props.zoom,
      pitch: props.pitch,
      style: getStyle(rootInDarkMode ? 'dark' : 'light')
    })

    // https://maplibre.org/maplibre-gl-js/docs/examples/animate-camera-around-point/
    const rotateCamera = (timestamp: number) => {
      // clamp the rotation between 0 -360 degrees
      // Divide timestamp by 100 to slow rotation to ~10 degrees / sec
      map.current?.rotateTo((timestamp / 120) % 360, { animate: false })
      // Request the next frame of the animation.
      requestAnimationFrame(rotateCamera)
    }

    document.addEventListener('theme-change', (e) => {
      map.current?.setStyle(getStyle((e as CustomEvent).detail.theme))
    })

    map.current.on('load', () => {
      const DECK_DATA = JSON.parse(window.atob(MAP_DATA))
      const layer = new ArcLayer({
        id: 'arc-layer',
        data: DECK_DATA,
        getSourceColor: [96, 165, 250],
        getTargetColor: [48, 98, 179],
        getWidth: 12,
        beforeId: 'Place labels'
      })

      const overlay = new MapboxOverlay({
        interleaved: true,
        layers: [layer]
      })

      map.current?.addControl(overlay)

      // Start the animation.
      rotateCamera(0)
    })
  })

  return (
    <div ref={mapContainer} className='relative h-full w-full'>
      {!props.interactive && (
        <div className='absolute inset-0 z-10 bg-black opacity-0'></div>
      )}
    </div>
  )
}
