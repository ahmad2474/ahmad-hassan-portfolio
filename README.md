# Ahmad Hassan — Portfolio

## Setup

```bash
npm install
npm run dev
```
Opens at http://localhost:3000

## Build for production
```bash
npm run build
# Output is in /dist — upload this folder to any host
```

## ⚡ Adding Your Photos

Put your images in `/public/images/` and they'll be available at `/images/filename.jpg`

| File                      | Used in             |
|---------------------------|---------------------|
| `hero-photo.jpg`          | Hero section (right side B&W close-up) |
| `about-photo.jpg`         | About section (elevator/tuxedo photo)  |
| `testi-bg.jpg`            | Testimonials ghost background          |
| `cta-bg.jpg`              | CTA full-bleed background              |
| `project-1.jpg`           | Bento card 1 (optional — mock shows if missing) |

## 📱 Customise

| What                  | Where                              |
|-----------------------|------------------------------------|
| WhatsApp number       | Find `923000000000` → replace all  |
| Email address         | Find `hello@ahmadhassan.com`       |
| Accent color          | `src/css/variables.css` → `--red`  |
| Fonts                 | `index.html` Google Fonts link     |
| Stats numbers         | `index.html` → `data-target="50"` |
| Project cards         | `index.html` → `.bento-card`      |

## Stack
- **Vite** — dev server + build
- **Vanilla JS** — modular ES modules
- **Pure Canvas 2D** — 3D orb (zero dependencies, works offline/mobile)
- **CSS custom properties** — all tokens in `variables.css`
- **IntersectionObserver** — scroll reveals + stat counters
