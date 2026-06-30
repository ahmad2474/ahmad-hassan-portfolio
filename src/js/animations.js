import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)

export function initAnimations() {
  const loader = document.getElementById('loader')
  if (loader) {
    gsap.to(loader, {
      opacity: 0, duration: 0.5, delay: 1.0, ease: 'power2.inOut',
      onComplete: () => { loader.style.display = 'none'; playHeroTimeline() }
    })
  } else { playHeroTimeline() }
}

function playHeroTimeline() {
  // Set initial states
  gsap.set(['.hero-eyebrow','.name-first','.name-second','.name-last','.hero-desc','.hero-actions','.hero-scroll-indicator'], { opacity: 0, y: 30 })
  gsap.set('.hero-photo-wrap', { opacity: 0, x: 60 })
  gsap.set('#orb-canvas', { opacity: 0 })

  const tl = gsap.timeline({ defaults: { ease: 'power4.out' } })

  // Photo slides in from right first
  tl.to('.hero-photo-wrap', { opacity: 1, x: 0, duration: 1.2, ease: 'power4.out' })

  // Eyebrow
  tl.to('.hero-eyebrow', { opacity: 1, y: 0, duration: 0.7 }, '-=0.8')

  // Headline lines stagger — first two from left, last (italic gold) from right
  tl.to('.name-first', { opacity: 1, y: 0, duration: 0.9 }, '-=0.5')
  tl.to('.name-second', { opacity: 1, y: 0, duration: 0.9 }, '-=0.7')
  tl.to('.name-last', { opacity: 1, y: 0, duration: 0.9 }, '-=0.7')

  // Desc + CTA
  tl.to('.hero-desc',    { opacity: 1, y: 0, duration: 0.7 }, '-=0.4')
  tl.to('.hero-actions', { opacity: 1, y: 0, duration: 0.6 }, '-=0.3')
  tl.to(['.hero-scroll-indicator'], { opacity: 1, y: 0, duration: 0.6 }, '-=0.1')

  // Canvas
  tl.to('#orb-canvas', { opacity: 1, duration: 1.5 }, '-=1.2')
}

export function initScrollAnimations() {
  // Work cards
  gsap.utils.toArray('.work-card').forEach((card, i) => {
    gsap.fromTo(card,
      { y: 60, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.85, delay: i * 0.1, ease: 'power3.out',
        scrollTrigger: { trigger: card, start: 'top 90%', toggleActions: 'play none none none' } }
    )
  })

  // Section titles — word by word
  gsap.utils.toArray('.section-title').forEach(el => {
    const html = el.innerHTML
    el.innerHTML = html.replace(/(\S+)/g,
      '<span style="display:inline-block;overflow:hidden;vertical-align:bottom"><span class="w" style="display:inline-block">$1</span></span>'
    )
    gsap.fromTo(el.querySelectorAll('.w'),
      { y: '110%' },
      { y: '0%', duration: 0.75, stagger: 0.07, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 86%', toggleActions: 'play none none none' } }
    )
  })

  // Stats counter + gold glow
  gsap.utils.toArray('.stat-number[data-target]').forEach(el => {
    const target = parseInt(el.dataset.target)
    const suffix = el.dataset.suffix || ''
    ScrollTrigger.create({
      trigger: el, start: 'top 80%', once: true,
      onEnter: () => {
        gsap.to({ val: 0 }, {
          val: target, duration: 2.2, ease: 'power2.out',
          onUpdate: function() { el.textContent = Math.round(this.targets()[0].val) + suffix }
        })
        gsap.fromTo(el,
          { textShadow: '0 0 40px rgba(201,168,76,1)' },
          { textShadow: '0 0 0px rgba(201,168,76,0)', duration: 2.5, ease: 'power2.out' }
        )
      }
    })
  })

  // Services slide from left
  gsap.utils.toArray('.service-item').forEach((item, i) => {
    gsap.fromTo(item,
      { x: -50, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.7, delay: i * 0.1, ease: 'power3.out',
        scrollTrigger: { trigger: item, start: 'top 88%', toggleActions: 'play none none none' } }
    )
  })

  // Testimonial cards scale in
  gsap.utils.toArray('.testi-card').forEach((card, i) => {
    gsap.fromTo(card,
      { scale: 0.93, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.8, delay: i * 0.12, ease: 'power3.out',
        scrollTrigger: { trigger: card, start: 'top 88%', toggleActions: 'play none none none' } }
    )
  })

  // About photo clip reveal from bottom
  gsap.fromTo('.photo-frame',
    { clipPath: 'inset(100% 0 0 0)' },
    { clipPath: 'inset(0% 0 0 0)', duration: 1.3, ease: 'power4.out',
      scrollTrigger: { trigger: '.photo-frame', start: 'top 80%', toggleActions: 'play none none none' } }
  )

  // About text stagger
  gsap.fromTo('.about-text-col > *',
    { y: 32, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.75, stagger: 0.1, ease: 'power3.out',
      scrollTrigger: { trigger: '.about-text-col', start: 'top 82%', toggleActions: 'play none none none' } }
  )

  // Section labels
  gsap.utils.toArray('.section-label').forEach(el => {
    gsap.fromTo(el,
      { opacity: 0, x: -20 },
      { opacity: 1, x: 0, duration: 0.6, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' } }
    )
  })

  // CTA cinematic
  const ctaTl = gsap.timeline({
    scrollTrigger: { trigger: '#cta', start: 'top 70%', toggleActions: 'play none none none' }
  })
  ctaTl
    .fromTo('.cta-line-1', { y: 70, opacity: 0 }, { y: 0, opacity: 1, duration: 1.0, ease: 'power4.out' })
    .fromTo('.cta-line-2', { y: 70, opacity: 0 }, { y: 0, opacity: 1, duration: 1.0, ease: 'power4.out' }, '-=0.6')
    .fromTo('.cta-sub',     { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }, '-=0.3')
    .fromTo('.cta-scarcity',{ opacity: 0 },         { opacity: 1, duration: 0.6 }, '-=0.2')
    .fromTo('.cta-actions > *', { y: 20, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.12, duration: 0.6, ease: 'power3.out' }, '-=0.1')

  // Ticker pause on hover
  const track = document.querySelector('.ticker-track')
  if (track) {
    track.addEventListener('mouseenter', () => track.style.animationPlayState = 'paused')
    track.addEventListener('mouseleave', () => track.style.animationPlayState = 'running')
  }
}
