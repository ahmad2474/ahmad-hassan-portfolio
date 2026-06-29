// reveal.js
export function initReveal() {
  const els = document.querySelectorAll('.reveal')
  if (!els.length) return

  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('is-visible')
        observer.unobserve(e.target)
      }
    })
  }, { threshold: 0.08 })

  els.forEach(el => observer.observe(el))
}
