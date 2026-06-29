import { initCursor }                          from './cursor.js'
import { initNav }                             from './nav.js'
import { initOrb, initAboutRing }              from './orb.js'
import { initAnimations, initScrollAnimations } from './animations.js'
import { initSmoothScroll }                    from './smoothScroll.js'
import { initReveal }                          from './reveal.js'

function safeInit(name, init) {
  try {
    init()
  } catch (error) {
    console.error(`[startup] ${name} failed`, error)
  }
}

function forceHideLoader() {
  const loader = document.getElementById('loader')
  if (!loader || loader.style.display === 'none') return

  loader.style.opacity = '0'
  loader.style.pointerEvents = 'none'
  window.setTimeout(() => {
    loader.style.display = 'none'
  }, 500)
}

document.addEventListener('DOMContentLoaded', () => {
  const loaderFallback = window.setTimeout(forceHideLoader, 2500)

  safeInit('cursor', initCursor)
  safeInit('nav', initNav)
  safeInit('orb', initOrb)
  safeInit('about ring', initAboutRing)
  safeInit('animations', initAnimations)
  safeInit('scroll animations', initScrollAnimations)
  safeInit('smooth scroll', initSmoothScroll)
  safeInit('reveal', initReveal)

  window.setTimeout(() => {
    window.clearTimeout(loaderFallback)
    forceHideLoader()
  }, 3000)
})
