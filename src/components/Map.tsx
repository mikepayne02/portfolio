import { useRef, useEffect } from 'react'
import { ArcLayer } from '@deck.gl/layers'
import { MapboxOverlay } from '@deck.gl/mapbox'
import 'maplibre-gl/dist/maplibre-gl.css'
import maplibre from 'maplibre-gl'

const { Map } = maplibre

import { MAPTILER_API_KEY } from 'astro:env/client'

interface MapProps {
  latitude: number
  longitude: number
  zoom: number
  pitch: number
  deck: string
  interactive: boolean
}

function getStyle(theme: string): string {
  return (
    (theme == 'dark'
      ? 'https://api.maptiler.com/maps/dataviz-dark/style.json?key='
      : 'https://api.maptiler.com/maps/dataviz-light/style.json?key=') +
    MAPTILER_API_KEY
  )
}

export default (props: MapProps) => {
  const mapContainer = useRef(null)
  const map = useRef<maplibregl.Map | null>(null)

  useEffect(() => {
    if (map.current) {
      return
    }

    const rootInDarkMode = document.documentElement.classList.contains('dark')

    map.current = new Map({
      container: mapContainer.current ?? '',
      interactive: props.interactive,
      center: [props.longitude, props.latitude],
      zoom: props.zoom,
      pitch: props.pitch,
      style: getStyle(rootInDarkMode ? 'dark' : 'light')
    })

    const initMap = map.current

    // https://maplibre.org/maplibre-gl-js/docs/examples/animate-camera-around-point/
    const rotateCamera = (timestamp: number) => {
      // clamp the rotation between 0 -360 degrees
      // Divide timestamp by 100 to slow rotation to ~10 degrees / sec
      initMap.rotateTo((timestamp / 120) % 360, { animate: false })
      // Request the next frame of the animation.
      requestAnimationFrame(rotateCamera)
    }

    document.addEventListener('theme-change', (e) => {
      initMap.setStyle(getStyle((e as CustomEvent).detail.theme))
    })

    initMap.on('load', () => {
      const layer = new ArcLayer({
        id: 'arc-layer',
        data: props.deck,
        getSourceColor: [96, 165, 250],
        getTargetColor: [48, 98, 179],
        getWidth: 12,
        beforeId: 'Place labels'
      })

      const overlay = new MapboxOverlay({
        interleaved: true,
        layers: [layer]
      })

      initMap.addControl(overlay)

      // Start the animation.
      rotateCamera(0)
    })
  })

  return (
    <div ref={mapContainer} className='relative h-full w-full'>
      <div className='absolute inset-0 z-10 cursor-default'></div>
    </div>
  )
}
