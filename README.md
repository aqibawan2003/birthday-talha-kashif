<div align="center">

# 🎂 Birthday Website — Talha Kashif

<img src="talha.jpg" width="110" alt="Talha Kashif"/>

### *An interactive, prank-loaded, feature-packed birthday experience*

[![Live Site](https://img.shields.io/badge/🌐_Live_Site-birthday--talha--kashif.vercel.app-7c6fff?style=for-the-badge)](https://birthday-talha-kashif.vercel.app)
[![Deployed on Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000000?style=for-the-badge&logo=vercel)](https://vercel.com)
[![GitHub Repo](https://img.shields.io/badge/Repo-GitHub-181717?style=for-the-badge&logo=github)](https://github.com/aqibawan2003/birthday-talha-kashif)

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![Canvas API](https://img.shields.io/badge/Canvas_API-FF6384?style=flat-square)
![Web Audio API](https://img.shields.io/badge/Web_Audio_API-4BC0C0?style=flat-square)
![Zero Dependencies](https://img.shields.io/badge/Dependencies-Zero-2ecc71?style=flat-square)

</div>

---

## 🧾 What Is This?

A **fully custom birthday website** built for **Talha Kashif** — packed with interactive features, easter eggs, pranks, achievements, animations, and a whole lot of personality.

No frameworks. No libraries (except one optional confetti CDN). Pure **HTML + CSS + Vanilla JavaScript**.

> 🔗 **Live Site:** [birthday-talha-kashif.vercel.app](https://birthday-talha-kashif.vercel.app)

---

## ✨ Feature Overview

### 🎨 Visual Design

| Feature | Details |
|---------|---------|
| **Dark Theme** | Deep space palette — `#010009` → `#0e0b2e` |
| **Aurora Background** | Animated CSS blobs using `radial-gradient` + `blur` |
| **Glassmorphism Cards** | `backdrop-filter`, rgba backgrounds, glowing borders |
| **Gradient Text** | `-webkit-background-clip: text` on headings |
| **Fully Responsive** | Mobile (360px) → Tablet (768px) → Laptop (1024px) → Desktop (1440px+) |
| **Scroll Reveal** | `IntersectionObserver` fade-in on every section |
| **3D Card Tilt** | CSS `perspective` + live `mousemove` tracking |
| **Haunted Cursor** | Custom cursor with a glowing color-trail |

---

### 🎮 Interactive Sections

<details>
<summary><b>🌟 Hero Section</b></summary>

- Profile photo with glowing ring + orbiting dot animation
- Live counter: *"X seconds since Talha was born"*
- Click-frenzy on the title — 10 clicks unlocks the 🏆 **Lord of Clicks** achievement
- **Celebrate** button → side confetti bursts + canvas fireworks overlay
- Floating particle field of emojis + colored dots
- Animated star field background

</details>

<details>
<summary><b>📊 Legend Stats</b></summary>

- Animated stat progress bars triggered by scroll (`IntersectionObserver`)
- Categories: Rizz Level, Brain Cells, Humour, Loyalty, Sleep Hours, Phone Battery
- Each bar animates from 0% to its target value on first view

</details>

<details>
<summary><b>🃏 Fun Cards</b></summary>

- 8 personality / fun-fact cards
- 3D hover tilt effect calculated from mouse position relative to card centre
- Glassmorphism styling with per-card accent glow colours

</details>

<details>
<summary><b>💌 Holographic Letter</b></summary>

- Full personalised letter with typewriter character-by-character effect
- Animated holographic shimmer header bar
- Signature photo at the bottom

</details>

<details>
<summary><b>🎡 Spin Wheel</b></summary>

- Drawn entirely on `<canvas>` — 8 coloured segments
- Eased deceleration animation (`easeOut`)
- Result detected by normalising final angle modulo segment width
- Segments: Roast · Free Hug · Dare · Compliment · Sing a Song · Pay for Lunch 😂 · King for a Day · Truth

</details>

<details>
<summary><b>📋 KPI Dashboard</b></summary>

- 6 birthday KPI goals with interactive checkboxes
- Completing all 6 unlocks the 💪 **KPI Crusher** achievement
- Completion sound effect via Web Audio API

</details>

<details>
<summary><b>🎂 Cake Explosion</b></summary>

- Canvas-based particle system (`CakePart` class)
- Click the cake → hundreds of particles burst with physics (gravity + fade-out)
- Animated candle flicker on the cake graphic

</details>

---

### 😈 Pranks — 9 Total

> All pranks are timed or interaction-triggered. Talha has absolutely no idea. 😂

| # | Prank | Trigger |
|---|-------|---------|
| 1 | **Fake Loading Screen** | On page load — progress bar sticks at 99% forever |
| 2 | **Windows XP Error** | Auto-fires after 25 seconds |
| 3 | **Virus Alert** | Auto-fires after 18 seconds |
| 4 | **AFK Detector** | 22 seconds of no mouse/keyboard/scroll activity |
| 5 | **Konami Code Easter Egg** | `↑ ↑ ↓ ↓ ← → ← → B A` — secret overlay unlocks |
| 6 | **Clipboard Hijack** | Any Ctrl+C / Cmd+C pastes a surprise message |
| 7 | **Fake Incoming Call** | Auto-fires after 12 seconds |
| 8 | **Rage Quit Button** | Button in Troll Zone — shakes the page |
| 9 | **Fake Certificate Download** | 7-step prank toast chain → downloads a real PNG certificate |

---

### 🏆 Achievement System

Achievements unlock through interaction and show a toast notification (top-right, queue-based).

| Badge | Achievement | Unlock Condition |
|-------|-------------|-----------------|
| 🎉 | First Visitor | Page loads |
| 👆 | Lord of Clicks | Click the hero title 10 times |
| 🎡 | Wheel Spinner | Use the spin wheel |
| 🎂 | Cake Blaster | Click the birthday cake |
| 🎮 | Konami Master | Enter the full Konami code |
| 📜 | Letter Reader | Scroll into the letter section |
| 💪 | KPI Crusher | Complete all 6 KPI tasks |
| 📜 | Certificate Owner | Download the official certificate |

---

### 🎵 8-bit Music Player

Built 100% with the **Web Audio API** — no audio files, no external assets.

- Happy Birthday melody composed note-by-note with `OscillatorNode` + `GainNode`
- Sound effects: fanfare, sad trombone, blip, KPI completion jingle
- Toggle play/pause button with animated equaliser bars in the corner

---

### 📜 Visual Certificate (PNG Download)

When the certificate button is triggered, a `<canvas>` (1400×990px) is painted entirely in JavaScript and exported as a PNG:

- Parchment-style gradient background with noise texture
- Gold double border with ornamental rosette medallions at all four corners
- `CERTIFIED` watermark diagonally stamped across the page
- Sunburst seal (deep red disc, gold rays, embedded 5-point star)
- **"Talha Kashif"** rendered in `Dancing Script` font with gold gradient
- 4 award badge tiles with rounded rectangles and icons
- Dual signature lines + circular date stamp (Cert No. TK-2026-001)
- Fine print: *"legally binding in 47 galaxies, but not on Earth"*

---

## 🗂️ File Structure

```
birthday-talha-kashif/
│
├── index.html     ← Full page — all sections, modals, overlays, prank elements
├── style.css      ← All styling — CSS variables, animations, responsive breakpoints
├── script.js      ← All behaviour — pranks, canvas, audio engine, achievements
├── talha.jpg      ← Profile photo used in hero, letter signature, footer
└── README.md      ← This file
```

---

## 🧠 How It Works

### Architecture

Single-page static site — no build tools, no bundler, no backend, no dependencies.

```
index.html
  ├── style.css  (design tokens, layout, all animations)
  └── script.js
       ├── Web Audio API      → music + sound effects (no audio files)
       ├── Canvas API         → fireworks, spin wheel, cake, certificate PNG
       ├── IntersectionObserver → scroll reveal + stat bar triggers
       ├── Clipboard API      → copy prank
       ├── Blob API           → certificate PNG download
       └── setTimeout / setInterval → all timed pranks
```

### CSS Design Tokens

All colours are CSS custom properties in `:root` — change once, updates everywhere:

```css
:root {
  --primary:   #7c6fff;   /* Purple  */
  --secondary: #f857a6;   /* Pink    */
  --gold:      #ffd700;
  --cyan:      #00d4ff;
  --bg-0:      #010009;   /* Darkest BG  */
  --bg-5:      #120a30;   /* Lightest dark BG */
  --glass:     rgba(255,255,255,0.07);
  --border:    rgba(255,255,255,0.12);
}
```

Section backgrounds use these variables to create seamless colour flow:

```
Hero(bg-0) → Stats(bg-3) → Fun(bg-4) → Letter(bg-5) → Wheel(bg-2) → ...
```

### Spin Wheel — Result Detection

```js
// Normalise final angle and find the winning segment index
const normalized = ((finalAngle % (2*Math.PI)) + 2*Math.PI) % (2*Math.PI);
const segAngle   = (2*Math.PI) / segments.length;
const winIndex   = Math.floor((2*Math.PI - normalized) / segAngle) % segments.length;
```

### Achievement Queue System

```js
// Achievements queue up instead of stacking on screen
const achievementQueue = [];
let achievementBusy = false;

function unlockAchievement(icon, label) {
    achievementQueue.push({ icon, label });
    if (!achievementBusy) processAchievementQueue();
}
```

---

## 📱 Responsive Breakpoints

| Breakpoint | Target | Key Layout Changes |
|-----------|--------|--------------------|
| Default | Mobile `< 540px` | Single-column grids, compact padding |
| `min-width: 540px` | Small phones | 2-column card grid |
| `min-width: 768px` | Tablet | Hero horizontal layout, 260px photo |
| `min-width: 1024px` | **Laptop** | 4-col cards, 3-col KPI, 300px photo |
| `min-width: 1440px` | Large Desktop | 1280px max-width containers, 340px photo |

---

## 🚀 Run Locally

No installation. No build step.

```bash
git clone https://github.com/aqibawan2003/birthday-talha-kashif.git
cd birthday-talha-kashif
```

**Option A — Just open the file:**
```bash
open index.html   # macOS
start index.html  # Windows
```

**Option B — Local dev server (recommended for full feature support):**
```bash
npx serve .
# Visit → http://localhost:3000
```

---

## 🛠️ Tech Stack

| Technology | How It's Used |
|-----------|---------------|
| **HTML5** | Page structure, `<canvas>` elements, semantic layout |
| **CSS3** | Aurora blobs, glassmorphism, keyframe animations, CSS variables |
| **Vanilla JavaScript** | All interactivity — zero frameworks |
| **Canvas API** | Fireworks, spin wheel, cake particles, certificate image |
| **Web Audio API** | 8-bit music + sound effects (no audio files at all) |
| **IntersectionObserver** | Scroll-triggered animations, stat bar reveals, achievements |
| **Clipboard API** | Copy prank — hijacks clipboard contents |
| **Blob + URL.createObjectURL** | Certificate PNG download without server |
| **Google Fonts** | Pacifico · Dancing Script · Poppins · Press Start 2P |
| **Font Awesome 6** | Icons throughout the UI |
| **canvas-confetti (CDN)** | Side confetti burst on Celebrate button |
| **Vercel** | Static hosting + global CDN (auto-deploys on `git push`) |

---

## 🎨 Colour Palette

| Swatch | Hex | Name |
|--------|-----|------|
| 🟣 | `#7c6fff` | Primary Purple |
| 🩷 | `#f857a6` | Secondary Pink |
| 🟡 | `#ffd700` | Gold |
| 🩵 | `#00d4ff` | Cyan |
| 🟢 | `#a8ff78` | Green |
| ⬛ | `#010009` | Dark Background |

---

## 👨‍💻 Created By

<div align="center">

**Aqib Ejaz**

[![Portfolio](https://img.shields.io/badge/Portfolio-aqibawan2003.vercel.app-7c6fff?style=for-the-badge)](https://aqibawan2003.vercel.app)

*Built with 💜 as a birthday gift for Talha Kashif*

---

*"This certificate is 100% real and legally binding in 47 galaxies (but not on Earth)."*
*— The Birthday Bureau™, Universe Division, Sector 7G*

</div>

---

## 🌟 **Features**
This project is a beautifully crafted, responsive web page built to celebrate birthdays in a unique, digital way. It includes:
- **Interactive Birthday Card**: A simulated letter envelope that dynamically opens on click.
- **Typewriter Effect**: A custom-scripted typewriter animation that reveals the letter content character-by-character in a clean monospaced font.
- **Cake Celebration Overlay**: A clickable cake that launches a stunning romantic full-screen celebration overlay, featuring floating heart particles and a continuous gradient-colored confetti/fireworks display.
- **Aesthetic Elements**: Floating balloon animations, interactive mouse-trail heart effects, and smooth layout transitions.

---

## 🛠️ **Tech Stack**
- **HTML5**: Structured semantic markup.
- **CSS3**: Premium custom styling, smooth transitions, and keyframe animations.
- **JavaScript (ES6+)**: Custom particle engines, dynamic typewriter logic, and interaction controllers.
- **Canvas-Confetti**: Integration of a high-performance particle confetti system.

---

## 🚀 **Getting Started & Customization**
To deploy this project or customize it for your own special events:

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/the-cipher-stack/Happy-Birthday-Website.git
   ```

2. **Customize the Letter Content**:
   - Open `index.html`.
   - Modify the text inside the `<h2>` tag within the `.card2` container. The script will automatically detect the new text and type it out.

3. **Modify the Instagram Link**:
   - Update the link in `index.html` footer and `README.md` to your own profile link.

4. **Deploy**:
   - Upload the files to any web server, GitHub Pages, Netlify, or Vercel.

---

## 📬 **Connect & Support**
Developed and maintained by **The Cipher Stack**.

- **Instagram**: [@the.cipher.stack](https://www.instagram.com/the.cipher.stack?igsh=dmdnbGNzbDNpZzlu)
- **GitHub**: [Hxni786](https://github.com/Hxni786)

Feel free to fork this project, open issues, or submit pull requests to enhance the features!
