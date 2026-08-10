// ── HERO: Gold floating particles + square rings around photo ──
export function initOrb() {
  const canvas = document.getElementById('orb-canvas')
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  let W, H
  const photoWrap = document.querySelector('.hero-photo-wrap')

  function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight }
  resize()
  window.addEventListener('resize', resize, { passive: true })

  function isMobile() { return window.innerWidth <= 900 }

  function getRingBounds() {
    if (!photoWrap) return null
    if (isMobile()) {
      // Mobile: photo is full-screen cover. Face is in the upper-center area.
      // Frame a portrait-sized ring around where the head/shoulders sit.
      const vw = window.innerWidth
      const vh = window.innerHeight
      const rw = vw * 0.80        // ring width: 72% of screen width
      const rh = vh * 0.62        // ring height: 52% of screen height
      const x  = (vw - rw) / 2   // horizontally centered
      const y  = vh * 0.08        // starts near the top — frames head area
      return { x, y, w: rw, h: rh }
    }
    const r = photoWrap.getBoundingClientRect()
    // Desktop — ring frames the photo's visible content area (not full padding box)
    const w = r.width * 0.66
    const h = r.height * 0.74
    const x = r.left + (r.width - w) / 2
    const y = r.top + (r.height - h) / 2 - r.height * 0.03
    return { x, y, w, h }
  }

  function drawRect(x, y, w, h, rad) {
    ctx.beginPath()
    ctx.moveTo(x+rad,y); ctx.lineTo(x+w-rad,y); ctx.arcTo(x+w,y,x+w,y+rad,rad)
    ctx.lineTo(x+w,y+h-rad); ctx.arcTo(x+w,y+h,x+w-rad,y+h,rad)
    ctx.lineTo(x+rad,y+h); ctx.arcTo(x,y+h,x,y+h-rad,rad)
    ctx.lineTo(x,y+rad); ctx.arcTo(x,y,x+rad,y,rad)
    ctx.closePath()
  }

  let ring1A = 0, ring2A = Math.PI / 4, t = 0

  function draw() {
    ctx.clearRect(0, 0, W, H)
    t += 0.016
    ring1A += 0.0045
    ring2A -= 0.0075

    // ── Square rings around the photo ──────────────────
    const bounds = getRingBounds()
    if (bounds) {
      const { x: rx, y: ry, w: rw, h: rh } = bounds
      const cx = rx + rw / 2, cy = ry + rh / 2

      // Ambient glow
      const gl = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(rw, rh) * 0.65)
      gl.addColorStop(0, 'rgba(201,168,76,0.06)')
      gl.addColorStop(1, 'rgba(201,168,76,0)')
      ctx.fillStyle = gl
      ctx.fillRect(rx - 100, ry - 100, rw + 200, rh + 200)

      // Ring 1 — solid, rotating CW
      ctx.save(); ctx.translate(cx, cy); ctx.rotate(ring1A); ctx.translate(-cx, -cy)
      drawRect(rx, ry, rw, rh, 10)
      ctx.strokeStyle = 'rgba(201,168,76,0.10)'; ctx.lineWidth = 16; ctx.stroke()
      drawRect(rx, ry, rw, rh, 10)
      ctx.strokeStyle = 'rgba(201,168,76,0.65)'; ctx.lineWidth = 1.3; ctx.stroke()
      const c1 = [[rx,ry],[rx+rw-11,ry],[rx,ry+rh-11],[rx+rw-11,ry+rh-11]]
      c1.forEach(([x,y]) => { ctx.fillStyle = 'rgba(201,168,76,0.95)'; ctx.fillRect(x,y,11,11) })
      ctx.restore()

      // Ring 2 — dashed, rotating CCW, slightly larger
      ctx.save(); ctx.translate(cx, cy); ctx.rotate(ring2A); ctx.translate(-cx, -cy)
      const pad2 = 16
      drawRect(rx-pad2, ry-pad2, rw+pad2*2, rh+pad2*2, 6)
      ctx.strokeStyle = 'rgba(201,168,76,0.30)'; ctx.lineWidth = 0.9
      ctx.setLineDash([11,7]); ctx.stroke(); ctx.setLineDash([])
      const c2 = [[rx-pad2,ry-pad2],[rx+rw+pad2-6,ry-pad2],[rx-pad2,ry+rh+pad2-6],[rx+rw+pad2-6,ry+rh+pad2-6]]
      c2.forEach(([x,y]) => {
        ctx.save(); ctx.translate(x+3,y+3); ctx.rotate(Math.PI/4)
        ctx.fillStyle = 'rgba(201,168,76,0.75)'; ctx.fillRect(-3,-3,6,6); ctx.restore()
      })
      ctx.restore()

      // Outer breathing ring
      const pb = 0.5 + 0.5 * Math.sin(t * 0.85)
      const pad3 = 36
      drawRect(rx-pad3, ry-pad3, rw+pad3*2, rh+pad3*2, 14)
      ctx.strokeStyle = `rgba(201,168,76,${0.06+pb*0.05})`; ctx.lineWidth = 0.6; ctx.stroke()

    }

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

  const pts = Array.from({ length: 40 }, () => ({
    angle: Math.random() * Math.PI * 2,
    speed: (Math.random() * 0.006 + 0.002) * (Math.random() > .5 ? 1 : -1),
    rOff: (Math.random() - .5) * 60,
    size: Math.random() * 2 + 0.5,
    alpha: Math.random() * 0.6 + 0.2,
    pulse: Math.random() * Math.PI * 2,
  }))

  function drawRect(x,y,w,h,r) {
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

    const gl = ctx.createRadialGradient(cx,cy,0,cx,cy,Math.max(rw,rh)*0.6)
    gl.addColorStop(0,'rgba(201,168,76,0.07)'); gl.addColorStop(1,'rgba(201,168,76,0)')
    ctx.fillStyle = gl; ctx.fillRect(0,0,W,H)

    ctx.save(); ctx.translate(cx,cy); ctx.rotate(ring1A); ctx.translate(-cx,-cy)
    drawRect(rx,ry,rw,rh,10)
    ctx.strokeStyle='rgba(201,168,76,0.08)'; ctx.lineWidth=16; ctx.stroke()
    drawRect(rx,ry,rw,rh,10)
    ctx.strokeStyle='rgba(201,168,76,0.60)'; ctx.lineWidth=1.2; ctx.stroke()
    ;[[rx,ry],[rx+rw-10,ry],[rx,ry+rh-10],[rx+rw-10,ry+rh-10]].forEach(([x,y])=>{
      ctx.fillStyle='rgba(201,168,76,0.95)'; ctx.fillRect(x,y,10,10)
    })
    ctx.restore()

    ctx.save(); ctx.translate(cx,cy); ctx.rotate(ring2A); ctx.translate(-cx,-cy)
    drawRect(rx-12,ry-12,rw+24,rh+24,6)
    ctx.strokeStyle='rgba(201,168,76,0.28)'; ctx.lineWidth=0.8
    ctx.setLineDash([10,7]); ctx.stroke(); ctx.setLineDash([])
    ;[[rx-12,ry-12],[rx+rw+12-6,ry-12],[rx-12,ry+rh+12-6],[rx+rw+12-6,ry+rh+12-6]].forEach(([x,y])=>{
      ctx.save(); ctx.translate(x+3,y+3); ctx.rotate(Math.PI/4)
      ctx.fillStyle='rgba(201,168,76,0.7)'; ctx.fillRect(-3,-3,6,6); ctx.restore()
    })
    ctx.restore()

    const pb = 0.5 + 0.5*Math.sin(t*0.9)
    drawRect(rx-28,ry-28,rw+56,rh+56,14)
    ctx.strokeStyle=`rgba(201,168,76,${0.06+pb*0.05})`; ctx.lineWidth=0.5; ctx.stroke()

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
