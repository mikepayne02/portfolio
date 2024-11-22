import { Suspense, lazy } from 'react'
const Map = lazy(() => import('./Map'))

import type { SVGProps } from 'react'

function SvgSpinners3DotsScale(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='1em'
      height='1em'
      viewBox='0 0 24 24'
      {...props}
    >
      <circle cx={4} cy={12} r={3} fill='currentColor'>
        <animate
          id='svgSpinners3DotsScale0'
          attributeName='r'
          begin='0;svgSpinners3DotsScale1.end-0.25s'
          dur='0.75s'
          values='3;.2;3'
        ></animate>
      </circle>
      <circle cx={12} cy={12} r={3} fill='currentColor'>
        <animate
          attributeName='r'
          begin='svgSpinners3DotsScale0.end-0.6s'
          dur='0.75s'
          values='3;.2;3'
        ></animate>
      </circle>
      <circle cx={20} cy={12} r={3} fill='currentColor'>
        <animate
          id='svgSpinners3DotsScale1'
          attributeName='r'
          begin='svgSpinners3DotsScale0.end-0.45s'
          dur='0.75s'
          values='3;.2;3'
        ></animate>
      </circle>
    </svg>
  )
}

export default () => {
  return (
    <div className='map mt-12 h-96 w-full overflow-hidden rounded-xl border border-border shadow'>
      <Suspense
        fallback={
          <div className='flex h-full w-full items-center justify-center'>
            <SvgSpinners3DotsScale style={{ width: '64px', height: '64px' }} />
          </div>
        }
      >
        <Map
          zoom={6}
          pitch={45}
          interactive={false}
          latitude={39.8807948544334}
          longitude={-95.6983122797664}
        />
      </Suspense>
    </div>
  )
}
