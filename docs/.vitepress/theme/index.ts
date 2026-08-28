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
  let touchDirectionHandled = false
  let anchorNavigationPending = window.location.hash.length > 0
  let downwardMomentumGuardTimer = 0
  let downwardMomentumGuardDeadline = 0
  let downwardMomentumGuardActive = false

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

    root.classList.toggle(
      'home-snap-enabled',
      isFirstScreen && !isAtOrAfterSecondScreen && !anchorNavigationPending
    )
  }

  const clearDownwardMomentumGuard = () => {
    window.clearTimeout(downwardMomentumGuardTimer)
    downwardMomentumGuardTimer = 0
    downwardMomentumGuardDeadline = 0
    downwardMomentumGuardActive = false
  }

  const armDownwardMomentumGuard = () => {
    downwardMomentumGuardActive = true
    downwardMomentumGuardDeadline = performance.now() + 720
    window.clearTimeout(downwardMomentumGuardTimer)
    downwardMomentumGuardTimer = window.setTimeout(clearDownwardMomentumGuard, 180)
  }

  const consumeDownwardMomentumGuard = () => {
    if (!downwardMomentumGuardActive) {
      return false
    }

    if (performance.now() >= downwardMomentumGuardDeadline) {
      clearDownwardMomentumGuard()
      return false
    }

    window.clearTimeout(downwardMomentumGuardTimer)
    downwardMomentumGuardTimer = window.setTimeout(clearDownwardMomentumGuard, 180)
    return true
  }

  const completeScrollAnimation = () => {
    const arrivedAtSecondScreen = isAnimating && animationTarget > animationStartY
    window.scrollTo({ top: animationTarget, left: 0, behavior: 'auto' })

    if (arrivedAtSecondScreen) {
      // Consume the tail of the wheel/touch gesture that initiated the
      // transition. It prevents a strong swipe from leaking past screen two.
      armDownwardMomentumGuard()
    }

    finishAnimation()
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
    clearDownwardMomentumGuard()
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
      completeScrollAnimation()
      return
    }

    animationFrame = requestAnimationFrame(runScrollAnimation)
  }

  const startScrollAnimation = (target: number) => {
    const currentY = window.scrollY

    if (Math.abs(target - currentY) <= 2) {
      window.scrollTo({ top: target, left: 0, behavior: 'auto' })
      finishAnimation()
      return
    }

    // Repeated wheel/touch events must not restart the same transition. A
    // change of target, however, intentionally reverses the current motion.
    if (isAnimating && Math.abs(animationTarget - target) <= 2) {
      return
    }

    cancelAnimationFrame(animationFrame)
    window.clearTimeout(animationTimeout)
    animationStartY = currentY
    animationTarget = target
    animationStartedAt = performance.now()
    isAnimating = true
    document.documentElement.classList.add('home-snap-animating')

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reducedMotion) {
      completeScrollAnimation()
      return
    }

    animationFrame = requestAnimationFrame(runScrollAnimation)
    animationTimeout = window.setTimeout(() => {
      if (!isAnimating) {
        return
      }

      completeScrollAnimation()
    }, 1200)
  }

  const scrollToSecondScreen = () => {
    const context = getHomeContext()

    if (!context || !isDesktopHome() || (!isAnimating && window.scrollY > 2)) {
      return
    }

    const target = getSecondScreenTop(context.quickStart)

    if (target <= 2) {
      return
    }

    startScrollAnimation(target)
  }

  const scrollToFirstScreen = () => {
    if (!isDesktopHome()) {
      return
    }

    startScrollAnimation(0)
  }

  const isAtSecondScreen = () => {
    const context = getHomeContext()

    if (!context || !isDesktopHome()) {
      return false
    }

    const target = getSecondScreenTop(context.quickStart)
    return target > 2 && Math.abs(window.scrollY - target) <= 8
  }

  const isQuickStartAnchorLink = (link: Element) => {
    if (link.hasAttribute('download') || link.hasAttribute('target')) {
      return false
    }

    const href = link.getAttribute('href')

    if (!href) {
      return false
    }

    let url: URL

    try {
      url = new URL(href, link.baseURI)
    } catch {
      return false
    }

    // Only take over in-page anchors: the hero "开始使用" button and the nav
    // "快速开始" link both resolve to #quick-start on the home page.
    return (
      url.origin === window.location.origin &&
      url.pathname === window.location.pathname &&
      url.search === window.location.search &&
      url.hash === '#quick-start'
    )
  }

  const onQuickStartAnchorClick = (event: MouseEvent) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return
    }

    const element = event.target instanceof Element ? event.target : null
    const link = element?.closest('a')

    if (!link || !isQuickStartAnchorLink(link)) {
      return
    }

    const context = getHomeContext()

    if (!context) {
      return
    }

    // VitePress's own click handler (registered before this one) has already
    // preventDefaulted the link and queued an instant jump to the anchor for
    // the next frame. Re-assert the pre-click position in that same frame —
    // before paint — and animate the transition with the same easing as the
    // wheel/keyboard snap.
    const restoreY = window.scrollY
    const quickStart = context.quickStart

    window.requestAnimationFrame(() => {
      const liveContext = getHomeContext()

      if (!liveContext || liveContext.quickStart !== quickStart) {
        return
      }

      window.scrollTo({ top: restoreY, left: 0, behavior: 'auto' })

      if (isDesktopHome()) {
        startScrollAnimation(getSecondScreenTop(liveContext.quickStart))
        return
      }

      // Below the snap breakpoint there is no JS scroll loop that could fight
      // touch input, so hand the transition to the browser's smooth scroll.
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

      window.scrollTo({
        top: getSecondScreenTop(liveContext.quickStart),
        left: 0,
        behavior: reducedMotion ? 'auto' : 'smooth'
      })
    })
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
      if (event.deltaY < 0) {
        event.preventDefault()
        scrollToFirstScreen()
      } else if (event.deltaY > 0) {
        event.preventDefault()
        scrollToSecondScreen()
      }
      return
    }

    if (downwardMomentumGuardActive && isAtSecondScreen()) {
      if (event.deltaY > 0 && consumeDownwardMomentumGuard()) {
        event.preventDefault()
        return
      }

      if (event.deltaY < 0) {
        clearDownwardMomentumGuard()
      }
    }

    if (window.scrollY <= 2 && event.deltaY > 0) {
      event.preventDefault()
      scrollToSecondScreen()
    } else if (isAtSecondScreen() && event.deltaY < 0) {
      event.preventDefault()
      scrollToFirstScreen()
    }
  }

  const onKeyDown = (event: KeyboardEvent) => {
    if (isEditableTarget(event.target) || !isDesktopHome()) {
      return
    }

    if (isAnimating) {
      event.preventDefault()
      if (isUpKey(event.key)) {
        scrollToFirstScreen()
      } else if (isDownKey(event.key)) {
        scrollToSecondScreen()
      }
      return
    }

    if (downwardMomentumGuardActive && isAtSecondScreen()) {
      if (isDownKey(event.key) && consumeDownwardMomentumGuard()) {
        event.preventDefault()
        return
      }

      if (isUpKey(event.key)) {
        clearDownwardMomentumGuard()
      }
    }

    if (window.scrollY <= 2 && isDownKey(event.key)) {
      event.preventDefault()
      scrollToSecondScreen()
    } else if (isAtSecondScreen() && isUpKey(event.key)) {
      event.preventDefault()
      scrollToFirstScreen()
    }
  }

  const onTouchStart = (event: TouchEvent) => {
    touchStartY = event.touches[0]?.clientY ?? null
    touchDirectionHandled = false
  }

  const onTouchMove = (event: TouchEvent) => {
    if (touchStartY === null || !isDesktopHome()) {
      return
    }

    if (touchDirectionHandled) {
      event.preventDefault()
      return
    }

    const currentY = event.touches[0]?.clientY ?? touchStartY
    const deltaY = touchStartY - currentY

    if (downwardMomentumGuardActive && isAtSecondScreen()) {
      if (deltaY > 8 && consumeDownwardMomentumGuard()) {
        event.preventDefault()
        return
      }

      if (deltaY < -8) {
        clearDownwardMomentumGuard()
      }
    }

    if (isAnimating) {
      if (deltaY < -8) {
        event.preventDefault()
        touchDirectionHandled = true
        scrollToFirstScreen()
      } else if (deltaY > 8) {
        event.preventDefault()
        touchDirectionHandled = true
        scrollToSecondScreen()
      } else {
        event.preventDefault()
      }
      return
    }

    if (window.scrollY <= 2 && deltaY > 8) {
      event.preventDefault()
      touchDirectionHandled = true
      scrollToSecondScreen()
    } else if (isAtSecondScreen() && deltaY < -8) {
      event.preventDefault()
      touchDirectionHandled = true
      scrollToFirstScreen()
    }
  }

  const onTouchEnd = () => {
    touchStartY = null
    touchDirectionHandled = false
  }

  window.addEventListener('wheel', onWheel, { capture: true, passive: false })
  window.addEventListener('keydown', onKeyDown, { capture: true })
  window.addEventListener('click', onQuickStartAnchorClick, { capture: true })
  window.addEventListener('touchstart', onTouchStart, { capture: true, passive: true })
  window.addEventListener('touchmove', onTouchMove, { capture: true, passive: false })
  window.addEventListener('touchend', onTouchEnd, { capture: true, passive: true })
  window.addEventListener('scroll', () => {
    if (window.scrollY > 2) {
      anchorNavigationPending = false
    }

    if (!isDesktopHome() && isAnimating) {
      cancelAnimation()
    }
    syncSnapScope()
  }, { passive: true })
  window.addEventListener('hashchange', () => {
    anchorNavigationPending = window.location.hash.length > 0
    syncSnapScope()
  })

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
