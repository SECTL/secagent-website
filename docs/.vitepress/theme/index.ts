import DefaultTheme from 'vitepress/theme'
import './custom.css'

function syncHomeFirstScreenLayout() {
  if (typeof window === 'undefined') {
    return
  }

  if (!document.body) {
    window.addEventListener('DOMContentLoaded', syncHomeFirstScreenLayout, { once: true })
    return
  }

  let frame = 0
  let layoutPass = 0

  const sync = () => {
    cancelAnimationFrame(frame)
    frame = requestAnimationFrame(() => {
      const home = document.querySelector<HTMLElement>('.VPHome')
      const content = home?.querySelector<HTMLElement>(':scope > .vp-doc')

      if (!content) {
        return
      }

      // The home content is the second screen. It must begin immediately
      // after the hero/features screen; a dynamic margin here creates a
      // visible blank strip at the bottom on short or tall viewports.
      content.style.removeProperty('margin-top')

      if (window.innerWidth < 960) {
        home.classList.remove('home-features-compact', 'home-features-tight')
        return
      }

      // Try the spacious layout first, then use the two-column compact layout
      // only when the rendered content really overflows its viewport slot.
      // Feature cards must remain in two rows; a single row creates a large
      // empty area between the hero and the cards on wide screens.
      const pass = ++layoutPass
      const modes = ['', 'home-features-compact']
      let modeIndex = 0

      const tryMode = () => {
        if (pass !== layoutPass) {
          return
        }

        home.classList.remove('home-features-compact', 'home-features-tight')
        const mode = modes[modeIndex]
        if (mode) {
          home.classList.add(mode)
        }

        frame = requestAnimationFrame(() => {
          if (pass !== layoutPass) {
            return
          }

          const hero = home.querySelector<HTMLElement>('.VPHomeHero')
          const features = home.querySelector<HTMLElement>('.VPHomeFeatures')
          const overflowing = Boolean(
            (hero && hero.scrollHeight > hero.clientHeight + 1) ||
            (features && features.scrollHeight > features.clientHeight + 1)
          )

          if (overflowing && modeIndex < modes.length - 1) {
            modeIndex += 1
            tryMode()
          }
        })
      }

      tryMode()
    })
  }

  const observer = new MutationObserver(sync)
  observer.observe(document.body, { childList: true, subtree: true })
  window.addEventListener('load', sync, { once: true })
  window.addEventListener('resize', sync, { passive: true })
  sync()
}

function setupHomeViewportSnap() {
  if (typeof window === 'undefined') {
    return
  }

  if (!document.body) {
    window.addEventListener('DOMContentLoaded', setupHomeViewportSnap, { once: true })
    return
  }

  let animationFrame = 0
  let animationTimeout = 0
  let isAnimating = false
  let animationTarget = 0
  let animationStartY = 0
  let animationStartedAt = 0
  let touchStartY: number | null = null

  // Do not let Chrome restore a previous scroll position after the home page
  // has mounted. VitePress handles explicit hash navigation separately.
  window.history.scrollRestoration = 'manual'

  const getHomeContext = () => {
    const content = document.querySelector<HTMLElement>('.VPContent.is-home')
    const features = content?.querySelector<HTMLElement>('.VPHomeFeatures')
    const quickStart = content?.querySelector<HTMLElement>('#quick-start')

    if (!content || !features || !quickStart) {
      return null
    }

    return { quickStart }
  }

  const isDesktopHome = () => window.innerWidth >= 960 && Boolean(getHomeContext())

  const getSecondScreenTop = (quickStart: HTMLElement) => {
    const nav = document.querySelector<HTMLElement>('.VPNav')
    const navHeight = nav?.getBoundingClientRect().height ?? 0
    return Math.max(0, quickStart.getBoundingClientRect().top + window.scrollY - navHeight)
  }

  const syncSnapScope = () => {
    const context = getHomeContext()
    const root = document.documentElement

    if (!context || window.innerWidth < 960) {
      root.classList.remove('home-snap-enabled')
      return
    }

    if (isAnimating) {
      return
    }

    const secondScreenTop = getSecondScreenTop(context.quickStart)
    const isFirstScreen = window.scrollY <= 2
    const isAtOrAfterSecondScreen = window.scrollY >= secondScreenTop - 2

    const hasExplicitAnchor = window.location.hash.length > 0
    root.classList.toggle(
      'home-snap-enabled',
      isFirstScreen && !isAtOrAfterSecondScreen && !hasExplicitAnchor
    )
  }

  const finishAnimation = () => {
    cancelAnimationFrame(animationFrame)
    window.clearTimeout(animationTimeout)
    isAnimating = false
    document.documentElement.classList.remove('home-snap-animating')
    syncSnapScope()
  }

  const cancelAnimation = () => {
    if (!isAnimating) {
      return
    }

    // An instant scroll to the current position cancels the in-flight
    // animation before handing control back to the user's gesture.
    const currentY = window.scrollY
    finishAnimation()
    window.scrollTo({ top: currentY, left: 0, behavior: 'auto' })
  }

  const runScrollAnimation = (timestamp: number) => {
    if (!isAnimating) {
      return
    }

    const progress = Math.min(1, (timestamp - animationStartedAt) / 760)
    const easedProgress = 1 - Math.pow(1 - progress, 3)
    const nextPosition = animationStartY + (animationTarget - animationStartY) * easedProgress

    window.scrollTo({ top: nextPosition, left: 0, behavior: 'auto' })

    if (progress >= 1) {
      window.scrollTo({ top: animationTarget, left: 0, behavior: 'auto' })
      finishAnimation()
      return
    }

    animationFrame = requestAnimationFrame(runScrollAnimation)
  }

  const scrollToSecondScreen = () => {
    const context = getHomeContext()

    if (!context || !isDesktopHome() || window.scrollY > 2 || isAnimating) {
      return
    }

    const target = getSecondScreenTop(context.quickStart)

    if (target <= 2) {
      return
    }

    animationStartY = window.scrollY
    animationTarget = target
    animationStartedAt = performance.now()
    isAnimating = true
    document.documentElement.classList.add('home-snap-animating')

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reducedMotion) {
      window.scrollTo({ top: target, left: 0, behavior: 'auto' })
      finishAnimation()
      return
    }

    animationFrame = requestAnimationFrame(runScrollAnimation)
    animationTimeout = window.setTimeout(() => {
      if (!isAnimating) {
        return
      }

      window.scrollTo({ top: animationTarget, left: 0, behavior: 'auto' })
      finishAnimation()
    }, 1200)
  }

  const isDownKey = (key: string) =>
    key === 'ArrowDown' || key === 'PageDown' || key === ' ' || key === 'End'

  const isUpKey = (key: string) =>
    key === 'ArrowUp' || key === 'PageUp' || key === 'Home'

  const isEditableTarget = (target: EventTarget | null) => {
    const element = target instanceof HTMLElement ? target : null
    return Boolean(element?.isContentEditable || element?.closest('input, textarea, select'))
  }

  const onWheel = (event: WheelEvent) => {
    if (!isDesktopHome()) {
      if (isAnimating) {
        cancelAnimation()
      }
      return
    }

    if (isAnimating) {
      if (event.deltaY < -1) {
        // Give control back to the user's upward gesture at the current
        // position instead of forcing another jump to the first screen.
        cancelAnimation()
      } else if (event.deltaY > 0) {
        // Keep repeated downward wheel ticks from pushing past the target
        // while the first-screen transition is still in progress.
        event.preventDefault()
      }
      return
    }

    if (window.scrollY <= 2 && event.deltaY > 0) {
      event.preventDefault()
      scrollToSecondScreen()
    }
  }

  const onKeyDown = (event: KeyboardEvent) => {
    if (isEditableTarget(event.target) || !isDesktopHome()) {
      return
    }

    if (isAnimating) {
      if (isUpKey(event.key)) {
        cancelAnimation()
      } else if (isDownKey(event.key)) {
        event.preventDefault()
      }
      return
    }

    if (window.scrollY <= 2 && isDownKey(event.key)) {
      event.preventDefault()
      scrollToSecondScreen()
    }
  }

  const onTouchStart = (event: TouchEvent) => {
    touchStartY = event.touches[0]?.clientY ?? null
  }

  const onTouchMove = (event: TouchEvent) => {
    if (touchStartY === null || !isDesktopHome()) {
      return
    }

    const currentY = event.touches[0]?.clientY ?? touchStartY
    const deltaY = touchStartY - currentY

    if (isAnimating) {
      if (deltaY < -8) {
        cancelAnimation()
      } else {
        event.preventDefault()
      }
      return
    }

    if (window.scrollY <= 2 && deltaY > 8) {
      event.preventDefault()
      scrollToSecondScreen()
    }
  }

  const onTouchEnd = () => {
    touchStartY = null
  }

  window.addEventListener('wheel', onWheel, { capture: true, passive: false })
  window.addEventListener('keydown', onKeyDown, { capture: true })
  window.addEventListener('touchstart', onTouchStart, { capture: true, passive: true })
  window.addEventListener('touchmove', onTouchMove, { capture: true, passive: false })
  window.addEventListener('touchend', onTouchEnd, { capture: true, passive: true })
  window.addEventListener('scroll', () => {
    if (!isDesktopHome() && isAnimating) {
      cancelAnimation()
    }
    syncSnapScope()
  }, { passive: true })
  window.addEventListener('hashchange', syncSnapScope)

  let homeWasMounted = false
  const syncHomeEntry = () => {
    const context = getHomeContext()

    if (!context) {
      homeWasMounted = false
      syncSnapScope()
      return
    }

    // Avoid opening the home page at a browser-restored second-screen
    // position. Explicit anchors such as /#quick-start are preserved.
    if (!homeWasMounted && !window.location.hash) {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
    }

    homeWasMounted = true
    syncSnapScope()
  }

  const entryObserver = new MutationObserver(syncHomeEntry)
  entryObserver.observe(document.body, { childList: true, subtree: true })
  window.addEventListener('load', syncHomeEntry, { once: true })
  syncHomeEntry()
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
    syncHomeFirstScreenLayout()
    setupHomeViewportSnap()
    syncHomeNavigationState()
  }
}

export default theme
