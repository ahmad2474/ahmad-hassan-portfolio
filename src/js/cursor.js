export function initCursor() {
  // Touch devices — skip entirely
  if (!window.matchMedia('(hover: hover)').matches) return

  const dot  = document.getElementById('cursor-dot')
  const ring = document.getElementById('cursor-ring')
  if (!dot || !ring) return

  let mx = 0, my = 0
  let rx = 0, ry = 0

  document.addEventListener('mousemove', e => {
    mx = e.clientX
    my = e.clientY
    dot.style.left = mx + 'px'
    dot.style.top  = my + 'px'
  })

  // Ring lags behind with lerp
  function loop() {
    rx += (mx - rx) * 0.12
    ry += (my - ry) * 0.12
    ring.style.left = rx + 'px'
    ring.style.top  = ry + 'px'
    requestAnimationFrame(loop)
  }
  loop()

  // Grow on interactive elements
  const targets = 'a, button, .bento-card, .service-item, .testi-card, .btn-primary, .btn-ghost'
  document.querySelectorAll(targets).forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'))
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'))
  })
}
