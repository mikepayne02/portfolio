import LineMdSunnyOutlineToMoonLoopTransition from '~icons/line-md/sunny-outline-to-moon-loop-transition'
import LineMdMoonToSunnyOutlineLoopTransition from '~icons/line-md/moon-to-sunny-outline-loop-transition'
import { useStore } from '@nanostores/react'
import { $darkMode } from '../themeStore'

export default () => {
  const darkMode = useStore($darkMode)

  return (
    <button
      onClick={() => $darkMode.set(!darkMode)}
      className='relative size-8 rounded-md border border-border bg-primary-foreground shadow-sm transition-colors hover:bg-border/25 hover:text-foreground/75 hover:shadow'
    >
      <span className='sr-only'>dark theme</span>
      <div className='absolute start-1/2 top-1/2 size-6 -translate-x-1/2 -translate-y-1/2'>
        {darkMode ? (
          <LineMdSunnyOutlineToMoonLoopTransition
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <LineMdMoonToSunnyOutlineLoopTransition
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        )}
      </div>
    </button>
  )
}
