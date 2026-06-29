export function initNav() {
  const navbar   = document.getElementById('navbar')
  const hamburger = document.querySelector('.hamburger')
  const mobileMenu = document.getElementById('mobileMenu')

  // Scroll class
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60)
  }, { passive: true })

  // Hamburger toggle
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const open = hamburger.classList.toggle('open')
      mobileMenu.classList.toggle('open', open)
      document.body.style.overflow = open ? 'hidden' : ''
    })

    // Close on mobile link click
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open')
        mobileMenu.classList.remove('open')
        document.body.style.overflow = ''
      })
    })
  }
}
