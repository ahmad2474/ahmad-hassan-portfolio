export function initOrb() {
  const canvas = document.getElementById('orb-canvas')
  if (!canvas) return
  const ctx = canvas.getContext('2d')

  let W, H, orbX, orbY
  let mouseX = 0, mouseY = 0
  let targetX = 0, targetY = 0

  // ── Resize ─────────────────────────────────────────────
  function resize() {
    W = canvas.width  = window.innerWidth
    H = canvas.height = window.innerHeight
    // Orb lives at 72% width, vertical center
    orbX = W * 0.72
    orbY = H * 0.50
    targetX = orbX
    targetY = orbY
  }
  resize()
  window.addEventListener('resize', resize, { passive: true })

  // ── Input tracking ──────────────────────────────────────
  window.addEventListener('mousemove', e => {
    mouseX = e.clientX
    mouseY = e.clientY
  }, { passive: true })
  window.addEventListener('touchmove', e => {
    mouseX = e.touches[0].clientX
    mouseY = e.touches[0].clientY
  }, { passive: true })

  // ── Particle system ─────────────────────────────────────
  const PARTICLE_COUNT = 280
  const BASE_R = 92        // core sphere radius
  const particles = []

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const theta = Math.random() * Math.PI * 2
    const phi   = Math.acos(2 * Math.random() - 1)
    particles.push({
      theta,
      phi,
      orbitR:  BASE_R + 30 + Math.random() * 60,
      speed:   0.0003 + Math.random() * 0.0007,
      size:    0.8 + Math.random() * 1.5,
      alpha:   0.18 + Math.random() * 0.55,
      offset:  Math.random() * Math.PI * 2,
    })
  }

  // ── Ring definitions ────────────────────────────────────
  const rings = [
    { r: 128, tilt:  0.35, speed:  0.28, alpha: 0.22, lw: 0.8 },
    { r: 152, tilt: -0.55, speed: -0.18, alpha: 0.13, lw: 0.6 },
    { r: 174, tilt:  0.70, speed:  0.11, alpha: 0.07, lw: 0.5 },
  ]

  let t = 0

  // ── Draw loop ───────────────────────────────────────────
  function draw() {
    ctx.clearRect(0, 0, W, H)

    // Smooth parallax follow
    targetX += (orbX + (mouseX - W * 0.5) * 0.045 - targetX) * 0.06
    targetY += (orbY + (mouseY - H * 0.5) * 0.045 - targetY) * 0.06
    const tx = targetX
    const ty = targetY

    const rot = t * 0.38

    // ── Ambient glow ──────────────────────────────────────
    const glow = ctx.createRadialGradient(tx, ty, 0, tx, ty, 270)
    glow.addColorStop(0,   'rgba(192,57,43,0.10)')
    glow.addColorStop(0.5, 'rgba(192,57,43,0.04)')
    glow.addColorStop(1,   'rgba(192,57,43,0)')
    ctx.beginPath()
    ctx.arc(tx, ty, 270, 0, Math.PI * 2)
    ctx.fillStyle = glow
    ctx.fill()

    // ── Core sphere ───────────────────────────────────────
    const core = ctx.createRadialGradient(tx - 28, ty - 28, 0, tx, ty, BASE_R)
    core.addColorStop(0,   'rgba(220,80,60,0.22)')
    core.addColorStop(0.5, 'rgba(192,57,43,0.10)')
    core.addColorStop(1,   'rgba(100,20,10,0.03)')
    ctx.beginPath()
    ctx.arc(tx, ty, BASE_R, 0, Math.PI * 2)
    ctx.fillStyle = core
    ctx.fill()

    // ── Longitude wireframe lines ─────────────────────────
    const LONGS = 12
    for (let i = 0; i < LONGS; i++) {
      const angle  = (i / LONGS) * Math.PI + rot
      const scaleX = Math.cos(angle)
      const alpha  = Math.abs(scaleX) * 0.26 + 0.04

      // north hemisphere arc
      ctx.beginPath()
      for (let a = 0; a <= Math.PI; a += 0.05) {
        const px = tx + BASE_R * Math.sin(a) * scaleX
        const py = ty - BASE_R * Math.cos(a)
        a === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py)
      }
      ctx.strokeStyle = `rgba(192,57,43,${alpha})`
      ctx.lineWidth   = 0.6
      ctx.stroke()

      // south hemisphere arc
      ctx.beginPath()
      for (let a = 0; a <= Math.PI; a += 0.05) {
        const px = tx + BASE_R * Math.sin(a) * scaleX
        const py = ty + BASE_R * Math.cos(a)
        a === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py)
      }
      ctx.strokeStyle = `rgba(192,57,43,${alpha})`
      ctx.stroke()
    }

    // ── Latitude wireframe lines ──────────────────────────
    const LATS = 10
    for (let i = 1; i < LATS; i++) {
      const phi2  = (i / LATS) * Math.PI
      const latR  = BASE_R * Math.sin(phi2)
      const latY  = ty - BASE_R * Math.cos(phi2)
      const alpha = 0.05 + 0.14 * Math.sin(phi2)

      ctx.beginPath()
      ctx.ellipse(tx, latY, latR, latR * 0.28, 0, 0, Math.PI * 2)
      ctx.strokeStyle = `rgba(192,57,43,${alpha})`
      ctx.lineWidth   = 0.6
      ctx.stroke()
    }

    // ── Outer rim ─────────────────────────────────────────
    ctx.beginPath()
    ctx.arc(tx, ty, BASE_R, 0, Math.PI * 2)
    ctx.strokeStyle = 'rgba(192,57,43,0.32)'
    ctx.lineWidth   = 1
    ctx.stroke()

    // ── Orbiting rings ────────────────────────────────────
    rings.forEach(rng => {
      const angle = t * rng.speed
      const cosA  = Math.cos(angle)
      const sinA  = Math.sin(angle)
      ctx.save()
      ctx.translate(tx, ty)
      ctx.transform(cosA, sinA * rng.tilt, -sinA, cosA * rng.tilt, 0, 0)
      ctx.beginPath()
      ctx.arc(0, 0, rng.r, 0, Math.PI * 2)
      ctx.strokeStyle = `rgba(192,57,43,${rng.alpha})`
      ctx.lineWidth   = rng.lw
      ctx.stroke()
      ctx.restore()
    })

    // ── Particles ─────────────────────────────────────────
    particles.forEach(p => {
      p.theta += p.speed
      const pulse = 0.85 + 0.15 * Math.sin(t * 1.2 + p.offset)
      const r     = p.orbitR * pulse

      const sinT = Math.sin(p.theta + rot * 0.5)
      const cosT = Math.cos(p.theta + rot * 0.5)
      const sinP = Math.sin(p.phi)
      const cosP = Math.cos(p.phi)

      const x3 = r * sinP * cosT
      const y3 = r * sinP * sinT * 0.28
      const z3 = r * cosP

      const px = tx + x3
      const py = ty + y3 + z3 * 0.24

      const depth  = (x3 / r + 1) / 2
      const alpha2 = p.alpha * (0.25 + 0.75 * depth)

      ctx.beginPath()
      ctx.arc(px, py, p.size, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(192,57,43,${alpha2})`
      ctx.fill()
    })

    // ── Specular highlight ────────────────────────────────
    const spec = ctx.createRadialGradient(tx - 32, ty - 30, 0, tx - 32, ty - 30, 50)
    spec.addColorStop(0, 'rgba(255,180,160,0.16)')
    spec.addColorStop(1, 'rgba(255,100,80,0)')
    ctx.beginPath()
    ctx.arc(tx, ty, BASE_R, 0, Math.PI * 2)
    ctx.fillStyle = spec
    ctx.fill()

    t += 0.012
    requestAnimationFrame(draw)
  }

  draw()
}
