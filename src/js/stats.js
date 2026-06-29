// stats.js — animated number counter when stat enters viewport
export function initStats() {
  const items = document.querySelectorAll('.stat-number[data-target]')
  if (!items.length) return

  function animateCount(el) {
    const target = parseInt(el.dataset.target, 10)
    const suffix = el.dataset.suffix || ''
    const duration = 1800
    const start = performance.now()

    function update(now) {
      const elapsed  = now - start
      const progress = Math.min(elapsed / duration, 1)
      // ease out quad
      const eased = 1 - (1 - progress) * (1 - progress)
      const value = Math.round(eased * target)
      el.textContent = value + suffix
      if (progress < 1) requestAnimationFrame(update)
    }
    requestAnimationFrame(update)
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        animateCount(e.target)
        observer.unobserve(e.target)
      }
    })
  }, { threshold: 0.5 })

  items.forEach(el => observer.observe(el))
}
