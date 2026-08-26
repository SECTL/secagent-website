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

      if (window.scrollY > 2) {
        return
      }

      if (window.innerWidth < 960) {
        home?.classList.remove('home-features-overflowing')
        content.style.removeProperty('margin-top')
        return
      }

      const features = home?.querySelector('.VPHomeFeatures')
      const overflowing = Boolean(
        features && features.getBoundingClientRect().bottom > window.innerHeight - 12
      )
      home?.classList.toggle('home-features-overflowing', overflowing)

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

function syncHomeNavigationState() {
  if (typeof window === 'undefined') {
    return
  }

  if (!document.body) {
    window.addEventListener('DOMContentLoaded', syncHomeNavigationState, { once: true })
    return
  }

  let frame = 0

  const sync = () => {
    cancelAnimationFrame(frame)
    frame = requestAnimationFrame(() => {
      const home = document.querySelector('.VPContent.is-home')
      const quickStart = document.querySelector('#quick-start')

      if (!home || !quickStart) {
        return
      }

      const links = Array.from(
        document.querySelectorAll<HTMLAnchorElement>(
          '.VPNavBarMenuLink, .VPNavScreenMenuLink'
        )
      )
      const homeLinks = links.filter((link) => link.textContent?.trim() === '首页')
      const quickStartLinks = links.filter(
        (link) =>
          link.textContent?.trim() === '快速开始' ||
          link.getAttribute('href')?.includes('#quick-start')
      )

      if (!homeLinks.length && !quickStartLinks.length) {
        return
      }

      const quickStartIsActive = quickStart.getBoundingClientRect().top <= window.innerHeight * 0.5

      for (const link of homeLinks) {
        link.classList.toggle('active', !quickStartIsActive)
        if (quickStartIsActive) {
          link.removeAttribute('aria-current')
        } else {
          link.setAttribute('aria-current', 'page')
        }
      }

      for (const link of quickStartLinks) {
        link.classList.toggle('active', quickStartIsActive)
        if (quickStartIsActive) {
          link.setAttribute('aria-current', 'page')
        } else {
          link.removeAttribute('aria-current')
        }
      }
    })
  }

  const observer = new MutationObserver(sync)
  observer.observe(document.body, { childList: true, subtree: true })
  window.addEventListener('scroll', sync, { passive: true })
  window.addEventListener('resize', sync, { passive: true })
  window.addEventListener('load', sync, { once: true })
  sync()
}

const theme = {
  ...DefaultTheme,
  enhanceApp(context: Parameters<NonNullable<typeof DefaultTheme.enhanceApp>>[0]) {
    DefaultTheme.enhanceApp(context)
    keepHomeFeaturesAboveDoc()
    syncHomeNavigationState()
  }
}

export default theme
