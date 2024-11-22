import { Suspense, lazy } from 'react'
import SvgSpinners3DotsScale from '~icons/svg-spinners/3-dots-scale'
const Map = lazy(() => import('./Map'))
import '@/styles/map.css'

export default () => {
  return (
    <div className='map mt-12 h-96 w-full overflow-hidden rounded-xl border border-border shadow'>
      <Suspense
        fallback={
          <div className='flex h-full w-full items-center justify-center'>
            <SvgSpinners3DotsScale
              style={{ width: '100px', height: '100px' }}
            />
          </div>
        }
      >
        <Map
          zoom={6}
          pitch={45}
          interactive={false}
          latitude={39.8807948544334}
          longitude={-95.6983122797664}
          deck='https://content.mikepayne.me/map-data.json'
        />
      </Suspense>
    </div>
  )
}
