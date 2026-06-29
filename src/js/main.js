import { initCursor }                          from './cursor.js'
import { initNav }                             from './nav.js'
import { initOrb, initAboutRing }              from './orb.js'
import { initAnimations, initScrollAnimations } from './animations.js'
import { initSmoothScroll }                    from './smoothScroll.js'

document.addEventListener('DOMContentLoaded', () => {
  initCursor()
  initNav()
  initOrb()
  initAboutRing()
  initAnimations()
  initScrollAnimations()
  initSmoothScroll()
})
