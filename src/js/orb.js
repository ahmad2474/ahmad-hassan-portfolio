// ── HERO: Gold floating particles ──────────────────────────
export function initOrb() {
  const canvas = document.getElementById('orb-canvas')
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  let W, H

  function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight }
  resize()
  window.addEventListener('resize', resize, { passive: true })

  // 80 drifting gold particles across the whole hero
  const particles = Array.from({ length: 80 }, () => ({
    x: Math.random() * 1200,
    y: Math.random() * 900,
    vx: (Math.random() - 0.5) * 0.35,
    vy: (Math.random() - 0.5) * 0.25,
    size: Math.random() * 2.4 + 0.5,
    alpha: Math.random() * 0.55 + 0.1,
    pulse: Math.random() * Math.PI * 2,
    pulseSpeed: Math.random() * 0.012 + 0.006,
  }))

  function draw() {
    ctx.clearRect(0, 0, W, H)
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy; p.pulse += p.pulseSpeed
      if (p.x < 0) p.x = W; if (p.x > W) p.x = 0
      if (p.y < 0) p.y = H; if (p.y > H) p.y = 0
      const a = p.alpha * (0.5 + 0.5 * Math.sin(p.pulse))

      // Glow
      const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 4)
      g.addColorStop(0, `rgba(201,168,76,${a * 0.7})`)
      g.addColorStop(1, 'rgba(201,168,76,0)')
      ctx.beginPath(); ctx.arc(p.x, p.y, p.size * 4, 0, Math.PI * 2)
      ctx.fillStyle = g; ctx.fill()

      // Core
      ctx.beginPath(); ctx.arc(p.x, p.y, p.size * 0.55, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(226,201,126,${a})`; ctx.fill()
    })
    requestAnimationFrame(draw)
  }
  draw()
}

// ── ABOUT: Gold square rings around photo ──────────────────
export function initAboutRing() {
  const canvas = document.getElementById('about-ring-canvas')
  if (!canvas) return
  const ctx = canvas.getContext('2d')

  let W, H, ring1A = 0, ring2A = Math.PI / 4, t = 0

  function resize() {
    const col = document.querySelector('.about-photo-col')
    if (!col) return
    const r = col.getBoundingClientRect()
    W = canvas.width  = r.width  + 80
    H = canvas.height = r.height + 80
  }
  resize()
  window.addEventListener('resize', resize, { passive: true })

  // Particles orbiting the about photo
  const pts = Array.from({ length: 40 }, () => ({
    angle: Math.random() * Math.PI * 2,
    speed: (Math.random() * 0.006 + 0.002) * (Math.random() > .5 ? 1 : -1),
    rOff: (Math.random() - .5) * 60,
    size: Math.random() * 2 + 0.5,
    alpha: Math.random() * 0.6 + 0.2,
    pulse: Math.random() * Math.PI * 2,
  }))

  function drawRect(x, y, w, h, r) {
    ctx.beginPath()
    ctx.moveTo(x+r,y); ctx.lineTo(x+w-r,y); ctx.arcTo(x+w,y,x+w,y+r,r)
    ctx.lineTo(x+w,y+h-r); ctx.arcTo(x+w,y+h,x+w-r,y+h,r)
    ctx.lineTo(x+r,y+h); ctx.arcTo(x,y+h,x,y+h-r,r)
    ctx.lineTo(x,y+r); ctx.arcTo(x,y,x+r,y,r)
    ctx.closePath()
  }

  function draw() {
    ctx.clearRect(0, 0, W, H)
    ring1A += 0.005; ring2A -= 0.008; t += 0.016

    const cx = W / 2, cy = H / 2
    const rw = W * 0.75, rh = H * 0.72
    const rx = cx - rw/2, ry = cy - rh/2

    // Ambient glow
    const gl = ctx.createRadialGradient(cx,cy,0,cx,cy,Math.max(rw,rh)*0.6)
    gl.addColorStop(0,'rgba(201,168,76,0.07)'); gl.addColorStop(1,'rgba(201,168,76,0)')
    ctx.fillStyle = gl; ctx.fillRect(0,0,W,H)

    // Ring 1 — rotating CW
    ctx.save(); ctx.translate(cx,cy); ctx.rotate(ring1A); ctx.translate(-cx,-cy)
    // Glow pass
    drawRect(rx,ry,rw,rh,10)
    ctx.strokeStyle='rgba(201,168,76,0.08)'; ctx.lineWidth=16; ctx.stroke()
    // Main stroke
    drawRect(rx,ry,rw,rh,10)
    ctx.strokeStyle='rgba(201,168,76,0.60)'; ctx.lineWidth=1.2; ctx.stroke()
    // Corners
    [[rx,ry],[rx+rw-10,ry],[rx,ry+rh-10],[rx+rw-10,ry+rh-10]].forEach(([x,y])=>{
      ctx.fillStyle='rgba(201,168,76,0.95)'; ctx.fillRect(x,y,10,10)
    })
    ctx.restore()

    // Ring 2 — dashed, CCW
    ctx.save(); ctx.translate(cx,cy); ctx.rotate(ring2A); ctx.translate(-cx,-cy)
    drawRect(rx-12,ry-12,rw+24,rh+24,6)
    ctx.strokeStyle='rgba(201,168,76,0.28)'; ctx.lineWidth=0.8
    ctx.setLineDash([10,7]); ctx.stroke(); ctx.setLineDash([])
    // Small diamond corners
    [[rx-12,ry-12],[rx+rw+12-6,ry-12],[rx-12,ry+rh+12-6],[rx+rw+12-6,ry+rh+12-6]].forEach(([x,y])=>{
      ctx.save(); ctx.translate(x+3,y+3); ctx.rotate(Math.PI/4)
      ctx.fillStyle='rgba(201,168,76,0.7)'; ctx.fillRect(-3,-3,6,6); ctx.restore()
    })
    ctx.restore()

    // Outermost breathe ring
    const pb = 0.5 + 0.5*Math.sin(t*0.9)
    drawRect(rx-28,ry-28,rw+56,rh+56,14)
    ctx.strokeStyle=`rgba(201,168,76,${0.06+pb*0.05})`; ctx.lineWidth=0.5; ctx.stroke()

    // Orbiting particles
    const baseR = (rw + rh) / 4
    pts.forEach(p => {
      p.angle += p.speed; p.pulse += 0.02
      const r2 = baseR + p.rOff + Math.sin(p.pulse)*12
      const px = cx + Math.cos(p.angle) * r2
      const py = cy + Math.sin(p.angle) * (r2 * rh/rw)
      const a = p.alpha * (0.4 + 0.6*Math.abs(Math.sin(p.pulse)))
      const g = ctx.createRadialGradient(px,py,0,px,py,p.size*3)
      g.addColorStop(0,`rgba(201,168,76,${a*0.8})`); g.addColorStop(1,'rgba(201,168,76,0)')
      ctx.beginPath(); ctx.arc(px,py,p.size*3,0,Math.PI*2); ctx.fillStyle=g; ctx.fill()
      ctx.beginPath(); ctx.arc(px,py,p.size*0.6,0,Math.PI*2)
      ctx.fillStyle=`rgba(226,201,126,${a})`; ctx.fill()
    })

    requestAnimationFrame(draw)
  }
  draw()
}
