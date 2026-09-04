// ===== FLOATING PARTICLES =====
(function createParticles() {
    const container = document.getElementById('particles');
    const colors = ['#6c63ff', '#f857a6', '#ffd700', '#ff5858', '#00d4ff', '#a8ff78'];
    const emojis = ['⭐', '✨', '🎉', '🎊', '🎈', '💫', '🌟'];

    for (let i = 0; i < 30; i++) {
        const el = document.createElement('div');
        el.classList.add('particle');
        const useEmoji = Math.random() > 0.6;
        if (useEmoji) {
            el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
            el.style.fontSize = (Math.random() * 14 + 10) + 'px';
            el.style.background = 'none';
            el.style.borderRadius = '0';
        } else {
            const size = Math.random() * 8 + 4;
            el.style.width = size + 'px';
            el.style.height = size + 'px';
            el.style.background = colors[Math.floor(Math.random() * colors.length)];
        }
        el.style.left = Math.random() * 100 + 'vw';
        el.style.animationDuration = (Math.random() * 15 + 10) + 's';
        el.style.animationDelay = (Math.random() * 10) + 's';
        container.appendChild(el);
    }
})();

// ===== CELEBRATE BUTTON =====
document.getElementById('celebrateBtn').addEventListener('click', function () {
    launchConfetti();
    triggerCelebrationOverlay();
});

function launchConfetti() {
    const duration = 4000;
    const end = Date.now() + duration;
    const colors = ['#6c63ff', '#f857a6', '#ffd700', '#ff5858', '#ffffff'];

    (function frame() {
        confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 }, colors });
        confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 }, colors });
        if (Date.now() < end) requestAnimationFrame(frame);
    })();
}

function triggerCelebrationOverlay() {
    const overlay = document.getElementById('celebrationOverlay');
    overlay.classList.add('active');

    // Big confetti burst
    setTimeout(() => {
        confetti({
            particleCount: 200,
            spread: 100,
            origin: { y: 0.5 },
            colors: ['#6c63ff', '#f857a6', '#ffd700', '#ff5858', '#ffffff']
        });
    }, 300);
}

function closeCelebration() {
    document.getElementById('celebrationOverlay').classList.remove('active');
}

// ===== LETTER REVEAL =====
const letterContent = `Hey Talha Kashif! 🎉

Man, where do I even start? You're not just a friend — you're that one buddy who makes every moment more fun, more real, and more worth remembering.

From the laughs we've shared to the nonsense we've gotten into, you've always been the kind of guy who shows up — for the good times AND the tough ones. That's rare, bro. And I don't take it for granted.

On your special day, I just want you to know: you're one of the best people I know, and I'm genuinely lucky to call you my buddy. Keep being the awesome, ambitious, and real guy you are!

Wishing you an epic birthday and an even more epic year ahead. We've got plenty more memories to make! 🥳

Stay blessed and stay legendary! 🔥`;

const readBtn = document.getElementById('readLetterBtn');
const letterBody = document.getElementById('letterBody');
const letterText = document.getElementById('letterText');
let typed = false;

readBtn.addEventListener('click', function () {
    if (!letterBody.classList.contains('open')) {
        letterBody.classList.add('open');
        readBtn.textContent = '✖ Close Letter';
        if (!typed) {
            typed = true;
            typeWriter(letterText, letterContent, 18);
        }
    } else {
        letterBody.classList.remove('open');
        readBtn.innerHTML = '<i class="fa-regular fa-envelope-open"></i> Open Letter';
    }
});

function typeWriter(el, text, speed) {
    let i = 0;
    el.textContent = '';
    const interval = setInterval(() => {
        if (i < text.length) {
            el.textContent += text.charAt(i);
            i++;
            // auto-scroll letter into view
            el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } else {
            clearInterval(interval);
        }
    }, speed);
}

// ===== WISH CARDS =====
function revealWish(card) {
    card.classList.toggle('revealed');
    if (card.classList.contains('revealed')) {
        confetti({
            particleCount: 30,
            spread: 60,
            origin: { y: 0.6 },
            colors: ['#6c63ff', '#f857a6', '#ffd700']
        });
    }
}

// ===== CAKE CLICK =====
document.getElementById('cakeWrapper').addEventListener('click', function () {
    const candles = document.querySelectorAll('.candle');
    candles.forEach((c, i) => {
        setTimeout(() => c.classList.add('blown'), i * 120);
    });

    setTimeout(() => {
        triggerCelebrationOverlay();
    }, candles.length * 120 + 200);
});

// ===== SCROLL REVEAL =====
const revealEls = document.querySelectorAll('.fun-card, .wish-card, .fun-section, .letter-section, .wishes-section, .cake-section');
revealEls.forEach(el => el.classList.add('reveal'));

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
