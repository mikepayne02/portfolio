import { useStore } from '@nanostores/react'
import { $darkMode } from './themeStore'
import { useEffect } from 'react'

$darkMode.set(document.documentElement.classList.contains('dark'))

export default () => {
  const darkMode = useStore($darkMode)

  useEffect(() => {
    document.dispatchEvent(
      new CustomEvent('theme-change', {
        detail: { theme: darkMode ? 'dark' : 'light' }
      })
    )
  })
}
