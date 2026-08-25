import DefaultTheme from 'vitepress/theme'
import './custom.css'

function keepHomeFeaturesAboveDoc() {
  if (typeof window === 'undefined') {
    return
  }

  if (!document.body) {
    window.addEventListener('DOMContentLoaded', keepHomeFeaturesAboveDoc, { once: true })
    return
  }

  let frame = 0

  const sync = () => {
    cancelAnimationFrame(frame)
    frame = requestAnimationFrame(() => {
      const home = document.querySelector('.VPHome')
      const content = home?.querySelector(':scope > .vp-doc')

      if (!content) {
        return
      }

      if (window.innerWidth < 960 || window.scrollY > 2) {
        content.style.removeProperty('margin-top')
        return
      }

      content.style.removeProperty('margin-top')
      const gap = Math.max(0, window.innerHeight - content.getBoundingClientRect().top)

      if (gap > 0) {
        content.style.setProperty('margin-top', `${gap}px`)
      }
    })
  }

  const observer = new MutationObserver(sync)
  observer.observe(document.body, { childList: true, subtree: true })
  window.addEventListener('load', sync, { once: true })
  window.addEventListener('resize', sync, { passive: true })
  sync()
}

const theme = {
  ...DefaultTheme,
  enhanceApp(context: Parameters<NonNullable<typeof DefaultTheme.enhanceApp>>[0]) {
    DefaultTheme.enhanceApp(context)
    keepHomeFeaturesAboveDoc()
  }
}

export default theme
