// ===== WEB AUDIO (8-BIT SOUNDS) =====
const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioCtx;
function getAudio() {
    if (!audioCtx) audioCtx = new AudioCtx();
    return audioCtx;
}
function playBeep(freq = 440, type = 'square', dur = 0.12, vol = 0.15) {
    try {
        const ctx = getAudio();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain); gain.connect(ctx.destination);
        osc.type = type; osc.frequency.value = freq;
        gain.gain.setValueAtTime(vol, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
        osc.start(); osc.stop(ctx.currentTime + dur);
    } catch (e) {}
}
function playFanfare() {
    const notes = [523, 659, 784, 1047];
    notes.forEach((n, i) => setTimeout(() => playBeep(n, 'square', 0.18, 0.12), i * 100));
}
function playSadTrombone() {
    const notes = [400, 350, 300, 250];
    notes.forEach((n, i) => setTimeout(() => playBeep(n, 'sawtooth', 0.22, 0.1), i * 120));
}
function playClick() { playBeep(800, 'square', 0.06, 0.08); }
function playKPI()   { playBeep(1000, 'square', 0.1, 0.1); }

// ===== HAUNTED CURSOR =====
const cursor = document.getElementById('hauntedCursor');
let cx = window.innerWidth / 2, cy = window.innerHeight / 2;
let tx = cx, ty = cy;
document.addEventListener('mousemove', e => { tx = e.clientX; ty = e.clientY; });
(function animCursor() {
    cx += (tx - cx) * 0.22;
    cy += (ty - cy) * 0.22;
    cursor.style.left = cx + 'px';
    cursor.style.top  = cy + 'px';
    requestAnimationFrame(animCursor);
})();
// Hide on touch devices
if ('ontouchstart' in window) cursor.style.display = 'none';

// ===== PARTICLES =====
(function() {
    const container = document.getElementById('particles');
    const colors = ['#6c63ff','#f857a6','#ffd700','#ff5858','#00d4ff','#a8ff78'];
    const emojis = ['⭐','✨','🎉','🎊','🎈','💫','🌟','🔥'];
    for (let i = 0; i < 28; i++) {
        const el = document.createElement('div');
        el.classList.add('particle');
        if (Math.random() > 0.55) {
            el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
            el.style.cssText += 'font-size:' + (Math.random()*12+8) + 'px;background:none;border-radius:0;';
        } else {
            const s = Math.random()*8+4;
            el.style.width = s+'px'; el.style.height = s+'px';
            el.style.background = colors[Math.floor(Math.random()*colors.length)];
        }
        el.style.left = Math.random()*100+'vw';
        el.style.animationDuration = (Math.random()*14+10)+'s';
        el.style.animationDelay    = (Math.random()*10)+'s';
        container.appendChild(el);
    }
})();

// ===== ACHIEVEMENT SYSTEM =====
const achievements = [];
let achieveQueue = [];
let achieveShowing = false;
function unlockAchievement(icon, name) {
    if (achievements.includes(name)) return;
    achievements.push(name);
    achieveQueue.push({icon, name});
    if (!achieveShowing) showNextAchieve();
}
function showNextAchieve() {
    if (!achieveQueue.length) { achieveShowing = false; return; }
    achieveShowing = true;
    const {icon, name} = achieveQueue.shift();
    const toast = document.getElementById('achievementToast');
    document.getElementById('achieveIcon').textContent = icon;
    document.getElementById('achieveName').textContent  = name;
    playFanfare();
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(showNextAchieve, 400);
    }, 3500);
}

// Arrival achievement
setTimeout(() => unlockAchievement('🎉', 'Arrived at the Party!'), 1500);

// ===== CELEBRATE BUTTON =====
document.getElementById('celebrateBtn').addEventListener('click', () => {
    playFanfare();
    launchSideConfetti();
    triggerCelebrationOverlay();
    unlockAchievement('🥳', 'Party Started!');
});

function launchSideConfetti() {
    const colors = ['#6c63ff','#f857a6','#ffd700','#ff5858','#ffffff'];
    const end = Date.now() + 4000;
    (function frame() {
        confetti({ particleCount: 5, angle: 60,  spread: 55, origin: { x: 0 }, colors });
        confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 }, colors });
        if (Date.now() < end) requestAnimationFrame(frame);
    })();
}

function triggerCelebrationOverlay() {
    document.getElementById('celebrationOverlay').classList.add('active');
    setTimeout(() => {
        confetti({ particleCount: 220, spread: 100, origin: { y: 0.5 }, colors: ['#6c63ff','#f857a6','#ffd700','#ff5858','#ffffff'] });
    }, 300);
}
function closeCelebration() {
    document.getElementById('celebrationOverlay').classList.remove('active');
}

// ===== HERO TITLE CLICK FRENZY =====
let titleClicks = 0;
const maxClicks = 10;
const heroTitle = document.getElementById('heroTitle');
const clickCountEl = document.getElementById('clickCount');
const clickHint = document.getElementById('clickHint');

heroTitle.addEventListener('click', () => {
    playClick();
    titleClicks++;
    heroTitle.classList.remove('shake');
    void heroTitle.offsetWidth;
    heroTitle.classList.add('shake');
    const remaining = maxClicks - titleClicks;
    if (remaining > 0) {
        clickCountEl.textContent = remaining;
    } else {
        clickHint.style.display = 'none';
        document.getElementById('frenzyOverlay').classList.add('active');
        playFanfare();
        setTimeout(() => {
            confetti({ particleCount: 300, spread: 120, origin: { y: 0.5 }, colors: ['#ffd700','#ff9800','#f857a6'] });
        }, 200);
        unlockAchievement('🏆', 'Lord of the Clicks!');
    }
});
function closeFrenzy() {
    document.getElementById('frenzyOverlay').classList.remove('active');
    titleClicks = 0;
    clickCountEl.textContent = maxClicks;
    clickHint.style.display = 'block';
}

// ===== TROLL BUTTON =====
const trollBtn = document.getElementById('trollBtn');
let trollAttempts = 0;
let trollTimeout;

trollBtn.addEventListener('mousemove', (e) => {
    if (trollAttempts >= 5) return;
    const rect = trollBtn.getBoundingClientRect();
    const btnCX = rect.left + rect.width / 2;
    const btnCY = rect.top  + rect.height / 2;
    const dx = e.clientX - btnCX;
    const dy = e.clientY - btnCY;

    // flee away from cursor
    const newX = Math.max(0, Math.min(window.innerWidth  - rect.width,  rect.left  - dx * 1.6));
    const newY = Math.max(0, Math.min(window.innerHeight - rect.height, rect.top   - dy * 1.6));

    trollBtn.style.position = 'fixed';
    trollBtn.style.left = newX + 'px';
    trollBtn.style.top  = newY + 'px';
    trollBtn.style.zIndex = '999';
    trollAttempts++;
    playBeep(200, 'sine', 0.08, 0.06);

    if (trollAttempts >= 5) {
        trollTimeout = setTimeout(() => showTrollPopup("Haha! Your $1,000,000 is stuck in traffic! 🚗💨"), 300);
    }
});

// For touch
trollBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    trollAttempts++;
    if (trollAttempts >= 3) showTrollPopup("Nice try! The money ran away from you! 😂");
});

trollBtn.addEventListener('click', () => {
    showTrollPopup("You actually clicked it?! Bold move, bro 😂 The money's on vacation!");
});

function showTrollPopup(msg) {
    clearTimeout(trollTimeout);
    document.getElementById('trollMsg').textContent = msg;
    document.getElementById('trollPopup').classList.add('active');
    playSadTrombone();
    // reset button position
    trollBtn.style.position = '';
    trollBtn.style.left = '';
    trollBtn.style.top  = '';
    trollAttempts = 0;
}
function closeTrollPopup() {
    document.getElementById('trollPopup').classList.remove('active');
}

// Troll claim buttons
document.querySelectorAll('.troll-claim-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        showTrollPopup(btn.dataset.msg);
        unlockAchievement('😂', 'Got Trolled!');
    });
});

// ===== HOLOGRAPHIC LETTER =====
const letterFull = `📡 TRANSMISSION RECEIVED — YEAR: 2027

Hey Talha Kashif!

This is you, from the future. I'm sending this back through time because some things need to be said on your birthday.

First: DO NOT eat the last slice. I know it looks good. Just... trust the future version of yourself.

Now — seriously, bro. Looking back from where I'm standing, today was actually the beginning of something huge for you. The dreams you've been chasing? They worked out. The grind was worth it.

But here's what I remember most — not the wins. It's the real ones who were there through it all. Your buddy who made this page for you? Keep that guy around. He's the real MVP 💙

You are wiser, stronger, and more legendary than you give yourself credit for. Stop doubting yourself and start moving like the king you are.

This year is going to hit different. I promise.

Now go celebrate before I accidentally send a spoiler.

— Talha, Year 2027 🚀
[END OF TRANSMISSION]`;

const readBtn = document.getElementById('readLetterBtn');
const letterBody = document.getElementById('letterBody');
const letterText = document.getElementById('letterText');
let typed = false;

readBtn.addEventListener('click', () => {
    if (!letterBody.classList.contains('open')) {
        letterBody.classList.add('open');
        readBtn.innerHTML = '✖ Close Transmission';
        playBeep(600, 'sine', 0.15, 0.08);
        if (!typed) {
            typed = true;
            typeWriter(letterText, letterFull, 16);
            unlockAchievement('📜', 'Read the Secret Letter!');
        }
    } else {
        letterBody.classList.remove('open');
        readBtn.innerHTML = '<i class="fa-solid fa-satellite-dish"></i> Decrypt Transmission';
    }
});

function typeWriter(el, text, speed) {
    let i = 0; el.textContent = '';
    const iv = setInterval(() => {
        if (i < text.length) { el.textContent += text.charAt(i++); }
        else clearInterval(iv);
    }, speed);
}

// ===== KPI TASKS =====
let kpiCompleted = 0;
function completeKPI(card) {
    if (card.classList.contains('completed')) return;
    card.classList.add('completed');
    playKPI();
    kpiCompleted++;
    confetti({ particleCount: 40, spread: 50, origin: { y: 0.6 }, colors: ['#00ff80','#ffd700'] });
    if (kpiCompleted === 1) unlockAchievement('📋', 'First Task Done!');
    if (kpiCompleted === 3) unlockAchievement('⚡', 'Half the KPIs Crushed!');
    if (kpiCompleted === 6) unlockAchievement('🏅', 'All KPIs Completed! Legend!');
}

// ===== CAKE EXPLOSION (Canvas Particles) =====
const canvas = document.getElementById('cakeCanvas');
const ctx2d  = canvas.getContext('2d');
let particles2d = [];
let animFrame;

function resizeCanvas() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Particle2D {
    constructor(x, y) {
        this.x = x; this.y = y;
        this.vx = (Math.random() - 0.5) * 18;
        this.vy = (Math.random() - 1.5) * 14;
        this.alpha = 1;
        this.size = Math.random() * 14 + 5;
        const palette = ['#ffd700','#f857a6','#6c63ff','#ff5858','#00d4ff','#a8ff78','#ff9800'];
        this.color = palette[Math.floor(Math.random() * palette.length)];
        this.shape = Math.random() > 0.5 ? 'circle' : 'star';
        this.rot = Math.random() * Math.PI * 2;
        this.rotSpeed = (Math.random() - 0.5) * 0.3;
        this.gravity = 0.45;
    }
    update() {
        this.vy += this.gravity;
        this.x += this.vx;
        this.y += this.vy;
        this.alpha -= 0.018;
        this.rot += this.rotSpeed;
    }
    draw(c) {
        c.save();
        c.globalAlpha = Math.max(0, this.alpha);
        c.fillStyle = this.color;
        c.translate(this.x, this.y);
        c.rotate(this.rot);
        if (this.shape === 'circle') {
            c.beginPath();
            c.arc(0, 0, this.size / 2, 0, Math.PI * 2);
            c.fill();
        } else {
            // star
            c.beginPath();
            for (let i = 0; i < 5; i++) {
                const angle = (i * Math.PI * 2) / 5 - Math.PI / 2;
                const outer = this.size / 2;
                const inner = outer * 0.45;
                c.lineTo(Math.cos(angle) * outer, Math.sin(angle) * outer);
                const a2 = angle + Math.PI / 5;
                c.lineTo(Math.cos(a2) * inner, Math.sin(a2) * inner);
            }
            c.closePath(); c.fill();
        }
        c.restore();
    }
}

function spawnExplosion(x, y, count = 120) {
    for (let i = 0; i < count; i++) particles2d.push(new Particle2D(x, y));
}

function animateCanvas() {
    ctx2d.clearRect(0, 0, canvas.width, canvas.height);
    particles2d = particles2d.filter(p => p.alpha > 0);
    particles2d.forEach(p => { p.update(); p.draw(ctx2d); });
    if (particles2d.length > 0) animFrame = requestAnimationFrame(animateCanvas);
    else { canvas.style.display = 'none'; cancelAnimationFrame(animFrame); }
}

let cakeClicked = false;
document.getElementById('cakeWrapper').addEventListener('click', function (e) {
    if (cakeClicked) return;
    cakeClicked = true;

    const candles = document.querySelectorAll('.candle');
    candles.forEach((c, i) => setTimeout(() => {
        c.classList.add('blown');
        playBeep(300 - i * 20, 'sine', 0.12, 0.1);
    }, i * 130));

    setTimeout(() => {
        // Canvas explosion
        const rect = document.getElementById('cakeImg').getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top  + rect.height / 2;
        canvas.style.display = 'block';
        spawnExplosion(cx, cy, 160);
        for (let r = 0; r < 3; r++) {
            setTimeout(() => spawnExplosion(
                cx + (Math.random()-0.5)*200,
                cy + (Math.random()-0.5)*100, 80
            ), r * 250);
        }
        animateCanvas();

        // Confetti
        confetti({ particleCount: 250, spread: 120, origin: { y: 0.6 }, colors: ['#ffd700','#f857a6','#6c63ff','#ff5858','#ffffff'] });

        // Big message
        triggerCelebrationOverlay();
        playFanfare();

        document.getElementById('cakeHint').textContent = '💥 BOOM! Wish made! 🌟';
        unlockAchievement('🕯️', 'Wish Granted!');

        // Reset after 5s so it can be clicked again
        setTimeout(() => {
            cakeClicked = false;
            candles.forEach(c => c.classList.remove('blown'));
            document.getElementById('cakeHint').textContent = '👆 Click me for MAGIC! 💥';
        }, 6000);
    }, candles.length * 130 + 200);
});

// ===== SCROLL REVEAL =====
document.querySelectorAll('.reveal').forEach(el => {
    new IntersectionObserver((entries) => {
        entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.1 }).observe(el);
});

// Scroll-based achievements
const sectionAchieves = [
    { id: 'achieveFun',    el: '.fun-section',    icon: '🎭', name: 'Discovered the Fun Zone!' },
    { id: 'achieveLetter', el: '.letter-section', icon: '🌌', name: 'Found the Future Message!' },
    { id: 'achieveKPI',    el: '.kpi-section',    icon: '📊', name: 'Entered the KPI Zone!' },
    { id: 'achieveTroll',  el: '.troll-section',  icon: '😈', name: 'Entered the Danger Zone!' },
    { id: 'achieveCake',   el: '.cake-section',   icon: '🎂', name: 'Found the Magic Cake!' },
];
sectionAchieves.forEach(({ el, icon, name }) => {
    const node = document.querySelector(el);
    if (!node) return;
    new IntersectionObserver((entries) => {
        entries.forEach(e => { if (e.isIntersecting) unlockAchievement(icon, name); });
    }, { threshold: 0.3 }).observe(node);
});
