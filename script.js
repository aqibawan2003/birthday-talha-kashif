// ============================================================
//  BIRTHDAY WEBSITE — script.js
// ============================================================

// ===== 8-BIT AUDIO ENGINE =====
const AC = window.AudioContext || window.webkitAudioContext;
let ac;
function getAC() { if (!ac) ac = new AC(); return ac; }

function playTone(freq, type='square', dur=0.12, vol=0.12, delay=0) {
    try {
        const ctx = getAC();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain); gain.connect(ctx.destination);
        osc.type = type; osc.frequency.value = freq;
        const t = ctx.currentTime + delay;
        gain.gain.setValueAtTime(vol, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + dur);
        osc.start(t); osc.stop(t + dur);
    } catch(e){}
}

function playFanfare() {
    [[523,.2],[659,.2],[784,.2],[1047,.3]].forEach(([f,d],i)=>playTone(f,'square',d,.1,i*.12));
}
function playSad() {
    [[400,.25],[350,.25],[300,.25],[250,.4]].forEach(([f,d],i)=>playTone(f,'sawtooth',d,.1,i*.14));
}
function playPop()   { playTone(900,'square',.07,.09); }
function playKPI()   { playTone(1100,'square',.09,.09); }
function playBlip()  { playTone(700,'sine',.05,.07); }

// ===== HAPPY BIRTHDAY 8-BIT MELODY =====
const C4=261.63, D4=293.66, E4=329.63, F4=349.23, G4=392, A4=440, Bb4=466.16, C5=523.25;
const MELODY = [
    [C4,300],[C4,150],[D4,450],[C4,450],[F4,450],[E4,900],[0,200],
    [C4,300],[C4,150],[D4,450],[C4,450],[G4,450],[F4,900],[0,200],
    [C4,300],[C4,150],[C5,450],[A4,450],[F4,450],[E4,450],[D4,900],[0,200],
    [Bb4,300],[Bb4,150],[A4,450],[F4,450],[G4,450],[F4,900]
];
let musicPlaying = false, musicTimeout = null;

function playMelody(noteIndex=0) {
    if (!musicPlaying) return;
    if (noteIndex >= MELODY.length) { noteIndex = 0; }
    const [freq, ms] = MELODY[noteIndex];
    if (freq > 0) playTone(freq, 'square', ms/1000 * .85, .1);
    musicTimeout = setTimeout(() => playMelody(noteIndex + 1), ms);
}

function toggleMusic() {
    musicPlaying = !musicPlaying;
    const icon  = document.getElementById('musicIcon');
    const vinyl = document.getElementById('musicVinyl');
    const btn   = document.getElementById('musicPlayBtn');
    if (musicPlaying) {
        getAC();
        if (ac.state === 'suspended') ac.resume();
        icon.className = 'fa-solid fa-pause';
        vinyl.classList.add('spin');
        btn.style.background = 'linear-gradient(135deg,#f857a6,#6c63ff)';
        playMelody(0);
        unlockAchievement('🎵','DJ Activated — Birthday Beats!');
    } else {
        clearTimeout(musicTimeout);
        icon.className = 'fa-solid fa-play';
        vinyl.classList.remove('spin');
        btn.style.background = '';
    }
}

// ===== HAUNTED CURSOR WITH TRAIL =====
const cursor = document.getElementById('hauntedCursor');
let cx=window.innerWidth/2, cy=window.innerHeight/2, tx=cx, ty=cy;
const trailColors = ['#6c63ff','#f857a6','#ffd700','#00d4ff','#a8ff78'];
let trailCount = 0;

document.addEventListener('mousemove', e => {
    tx = e.clientX; ty = e.clientY;
    // Spawn trail dot every 3rd move
    if (trailCount++ % 3 === 0) {
        const dot = document.createElement('div');
        dot.className = 'trail-dot';
        dot.style.cssText = `left:${e.clientX}px;top:${e.clientY}px;background:${trailColors[Math.floor(Math.random()*trailColors.length)]};width:${Math.random()*8+4}px;height:${Math.random()*8+4}px`;
        document.getElementById('cursorTrail').appendChild(dot);
        setTimeout(() => dot.remove(), 500);
    }
});

(function animCursor() {
    cx += (tx - cx) * 0.2;
    cy += (ty - cy) * 0.2;
    cursor.style.left = cx + 'px';
    cursor.style.top  = cy + 'px';
    requestAnimationFrame(animCursor);
})();

// ===== HERO STARS =====
(function spawnStars() {
    const container = document.getElementById('heroStars');
    for (let i = 0; i < 60; i++) {
        const s = document.createElement('div');
        s.className = 'star-dot';
        const size = Math.random() * 2.5 + 0.5;
        s.style.cssText = `width:${size}px;height:${size}px;top:${Math.random()*100}%;left:${Math.random()*100}%;animation-duration:${Math.random()*3+2}s;animation-delay:${Math.random()*4}s`;
        container.appendChild(s);
    }
})();

// ===== PARTICLES =====
(function spawnParticles() {
    const c = document.getElementById('particles');
    const emojis = ['⭐','✨','🎊','💫','🌟','🎆','💎','🎇','🌠'];
    const colors = ['#6c63ff','#f857a6','#ffd700','#00d4ff','#a8ff78','#ff5858'];
    for (let i = 0; i < 26; i++) {
        const el = document.createElement('div');
        el.classList.add('particle');
        if (Math.random() > .5) {
            el.textContent = emojis[Math.floor(Math.random()*emojis.length)];
            el.style.cssText += 'font-size:'+(Math.random()*12+8)+'px;background:none;border-radius:0';
        } else {
            const s = Math.random()*8+3;
            el.style.width=s+'px'; el.style.height=s+'px';
            el.style.background=colors[Math.floor(Math.random()*colors.length)];
        }
        el.style.left = Math.random()*100+'vw';
        el.style.animationDuration = (Math.random()*14+9)+'s';
        el.style.animationDelay    = (Math.random()*10)+'s';
        c.appendChild(el);
    }
})();

// ===== ACHIEVEMENT SYSTEM =====
const unlocked = new Set();
let queue = [], showing = false;

function unlockAchievement(icon, name) {
    if (unlocked.has(name)) return;
    unlocked.add(name);
    queue.push({icon, name});
    if (!showing) showNext();
}

function showNext() {
    if (!queue.length) { showing = false; return; }
    showing = true;
    const {icon, name} = queue.shift();
    const toast = document.getElementById('achievementToast');
    document.getElementById('achieveIcon').textContent = icon;
    document.getElementById('achieveName').textContent  = name;
    playFanfare();
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(showNext, 500);
    }, 3800);
}

setTimeout(() => unlockAchievement('🎊','Welcome to Talha\'s Birthday!'), 1800);

// ===== LIVE COUNTER =====
let liveSeconds = 0;
const liveEl = document.getElementById('liveTimer');
setInterval(() => { liveSeconds++; liveEl.textContent = liveSeconds.toLocaleString(); }, 1000);

// ===== CELEBRATE BUTTON =====
document.getElementById('celebrateBtn').addEventListener('click', () => {
    playFanfare();
    launchSideConfetti();
    triggerCelebrationOverlay();
    unlockAchievement('🥳','Party Mode Activated!');
});

function launchSideConfetti() {
    const colors = ['#6c63ff','#f857a6','#ffd700','#ff5858','#ffffff','#00d4ff'];
    const end = Date.now() + 4500;
    (function frame() {
        confetti({particleCount:5,angle:60, spread:55,origin:{x:0},colors});
        confetti({particleCount:5,angle:120,spread:55,origin:{x:1},colors});
        if (Date.now()<end) requestAnimationFrame(frame);
    })();
}

function triggerCelebrationOverlay() {
    const ov = document.getElementById('celebrationOverlay');
    ov.classList.add('active');
    startFireworks();
    setTimeout(() => confetti({particleCount:250,spread:110,origin:{y:.5},colors:['#6c63ff','#f857a6','#ffd700','#ff5858','#fff']}), 300);
}
function closeCelebration() {
    document.getElementById('celebrationOverlay').classList.remove('active');
    stopFireworks();
}

// ===== FIREWORKS ON CANVAS =====
let fwCtx, fwAnim, fwRunning=false;
function startFireworks() {
    const cv = document.getElementById('fireworkCanvas');
    cv.width  = window.innerWidth;
    cv.height = window.innerHeight;
    fwCtx = cv.getContext('2d');
    fwRunning = true;
    animFireworks();
}
function stopFireworks() { fwRunning = false; if(fwCtx) fwCtx.clearRect(0,0,9999,9999); }

const fwParticles = [];
function animFireworks() {
    if (!fwRunning) return;
    fwCtx.fillStyle = 'rgba(2,0,16,.15)';
    fwCtx.fillRect(0,0,fwCtx.canvas.width,fwCtx.canvas.height);
    if (Math.random()<.06) spawnFirework();
    fwParticles.forEach((p,i) => {
        p.x+=p.vx; p.y+=p.vy; p.vy+=.05; p.alpha-=.013;
        fwCtx.globalAlpha = Math.max(0,p.alpha);
        fwCtx.beginPath();
        fwCtx.arc(p.x,p.y,p.r,0,Math.PI*2);
        fwCtx.fillStyle=p.color; fwCtx.fill();
        if(p.alpha<=0) fwParticles.splice(i,1);
    });
    fwCtx.globalAlpha=1;
    requestAnimationFrame(animFireworks);
}
function spawnFirework() {
    const x=Math.random()*fwCtx.canvas.width;
    const y=Math.random()*fwCtx.canvas.height*.6;
    const palette=['#ffd700','#f857a6','#6c63ff','#00d4ff','#a8ff78','#ff5858','#fff'];
    const color=palette[Math.floor(Math.random()*palette.length)];
    for(let i=0;i<60;i++){
        const angle=Math.random()*Math.PI*2;
        const speed=Math.random()*5+1;
        fwParticles.push({x,y,vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed,alpha:1,r:Math.random()*2+1,color});
    }
}

// ===== TITLE CLICK FRENZY =====
let titleClicks=0;
const heroTitle = document.getElementById('heroTitle');
const clickCountEl = document.getElementById('clickCount');
const clickHint = document.getElementById('clickHint');

heroTitle.addEventListener('click', () => {
    playBlip();
    titleClicks++;
    heroTitle.classList.remove('shake');
    void heroTitle.offsetWidth;
    heroTitle.classList.add('shake');
    const rem = 10 - titleClicks;
    if (rem > 0) { clickCountEl.textContent = rem; }
    else {
        clickHint.style.display='none';
        document.getElementById('frenzyOverlay').classList.add('active');
        playFanfare();
        setTimeout(()=>confetti({particleCount:300,spread:130,origin:{y:.5},colors:['#ffd700','#ff9800','#f857a6']}),200);
        unlockAchievement('🏆','LORD OF THE CLICKS!');
    }
});
function closeFrenzy() {
    document.getElementById('frenzyOverlay').classList.remove('active');
    titleClicks=0; clickCountEl.textContent=10; clickHint.style.display='block';
}

// ===== TROLL BUTTON (SLIDES AWAY) =====
const trollBtn = document.getElementById('trollBtn');
let trollTries=0;

trollBtn.addEventListener('mousemove', e => {
    if (trollTries>=5) return;
    const r=trollBtn.getBoundingClientRect();
    const dx=e.clientX-(r.left+r.width/2);
    const dy=e.clientY-(r.top+r.height/2);
    const nx=Math.max(0,Math.min(window.innerWidth-r.width,   r.left-dx*1.8));
    const ny=Math.max(0,Math.min(window.innerHeight-r.height, r.top -dy*1.8));
    trollBtn.style.cssText=`position:fixed;left:${nx}px;top:${ny}px;z-index:9999`;
    trollTries++;
    playTone(180,'sine',.07,.06);
    if (trollTries>=5) setTimeout(()=>showTrollPopup("Haha! Your $1,000,000 is stuck in traffic! 🚗💨"),300);
});
trollBtn.addEventListener('touchstart', e=>{ e.preventDefault(); trollTries++; if(trollTries>=2) showTrollPopup("Nice try! The money ran away from you! 😂"); });
trollBtn.addEventListener('click', ()=>showTrollPopup("You actually clicked it?! Bold move bro 😂 The money's on vacation!"));

document.querySelectorAll('.troll-claim-btn').forEach(btn=>{
    btn.addEventListener('click',()=>{
        showTrollPopup(btn.dataset.msg);
        unlockAchievement('😂','Got Trolled Again!');
    });
});

function showTrollPopup(msg) {
    document.getElementById('trollMsg').textContent = msg;
    document.getElementById('trollPopup').classList.add('active');
    playSad();
    trollBtn.style.cssText='';
    trollTries=0;
}
function closeTrollPopup() { document.getElementById('trollPopup').classList.remove('active'); }

// ===== HOLOGRAPHIC LETTER =====
const LETTER = `📡 TRANSMISSION RECEIVED — YEAR: 2027

Hey Talha Kashif!

This is you — from the future. I'm sending this back through time because some things need to be said on your birthday.

First: DO NOT eat the last slice of cake. I know it looks perfect. Just... trust your future self on this one.

Now, seriously bro — looking back from where I'm standing right now, today was the start of something massive. The dreams you're chasing? They worked out. Every late night, every tough day, every moment you kept going — it was worth it.

But here's what I remember most from this era — not the wins, not the achievements. It's the real ones who showed up. Your buddy who built this page for you? Keep that guy around. Absolute legend. 💙

Stop doubting yourself. You are wiser than you think, stronger than you know, and more legendary than you give yourself credit for.

This year is about to hit different. Trust the process. Trust yourself.

Now go celebrate before I accidentally send a spoiler.

— Talha Kashif, Year 2027 🚀
[ END OF QUANTUM TRANSMISSION ]`;

const readBtn = document.getElementById('readLetterBtn');
const letterBody = document.getElementById('letterBody');
const letterText = document.getElementById('letterText');
let typed = false;

readBtn.addEventListener('click', () => {
    if (!letterBody.classList.contains('open')) {
        letterBody.classList.add('open');
        readBtn.innerHTML = '✖ &nbsp;Close Transmission';
        playTone(600,'sine',.18,.08);
        if (!typed) {
            typed=true;
            typeWriter(letterText, LETTER, 14);
            unlockAchievement('🌌','Received Future Transmission!');
        }
    } else {
        letterBody.classList.remove('open');
        readBtn.innerHTML = '<i class="fa-solid fa-satellite-dish"></i> &nbsp;Decrypt Transmission';
    }
});

function typeWriter(el, text, spd) {
    let i=0; el.textContent='';
    const iv=setInterval(()=>{ if(i<text.length) el.textContent+=text.charAt(i++); else clearInterval(iv); }, spd);
}

// ===== LEGEND STATS ANIMATION =====
function animateStats() {
    document.querySelectorAll('.stat-card').forEach(card => {
        const fill = card.querySelector('.stat-fill');
        const valEl = card.querySelector('.stat-val');
        const target = parseInt(valEl.dataset.target) || 100;
        const isMax = valEl.dataset.target === 'MAX';
        fill.style.width = fill.style.getPropertyValue('--target') || '100%';
        let current=0;
        const iv = setInterval(()=>{
            current = Math.min(current+2, target);
            valEl.textContent = isMax ? (current>=100 ? '🔥 MAX' : current+'%') : current+'%';
            if (current>=target) clearInterval(iv);
        }, 25);
    });
    unlockAchievement('💎','Legend Stats Revealed!');
}
let statsAnimated=false;
new IntersectionObserver(entries=>{
    if(entries[0].isIntersecting && !statsAnimated) { statsAnimated=true; animateStats(); }
},{threshold:.3}).observe(document.querySelector('.stats-section'));

// ===== SPIN THE WHEEL =====
const WHEEL_SEGMENTS = [
    {label:'Eat 5 pizzas 🍕',   color:'#6c63ff'},
    {label:'Happy dance 💃',    color:'#f857a6'},
    {label:'Call your bestie 📞',color:'#ffd700'},
    {label:'Take a selfie 📸',  color:'#00d4ff'},
    {label:'Give yourself a hug 🤗', color:'#a8ff78'},
    {label:'Make a wish 🌠',    color:'#ff5858'},
    {label:'Eat the cake slice 🎂',  color:'#ff9800'},
    {label:'Dance for 10s 🕺',  color:'#c084fc'},
];
const wheelCv = document.getElementById('wheelCanvas');
const wheelCtx = wheelCv.getContext('2d');
const SEG = WHEEL_SEGMENTS.length;
const ARC = (2 * Math.PI) / SEG;
let wheelAngle=0, spinning=false;

function drawWheel(angle=0) {
    const cx=wheelCv.width/2, cy=wheelCv.height/2, r=cx-10;
    wheelCtx.clearRect(0,0,wheelCv.width,wheelCv.height);
    WHEEL_SEGMENTS.forEach((seg,i)=>{
        const start=angle+i*ARC, end=start+ARC;
        wheelCtx.beginPath();
        wheelCtx.moveTo(cx,cy);
        wheelCtx.arc(cx,cy,r,start,end);
        wheelCtx.closePath();
        wheelCtx.fillStyle=seg.color;
        wheelCtx.fill();
        wheelCtx.strokeStyle='rgba(255,255,255,.12)';
        wheelCtx.lineWidth=2;
        wheelCtx.stroke();
        // Label
        wheelCtx.save();
        wheelCtx.translate(cx,cy);
        wheelCtx.rotate(start+ARC/2);
        wheelCtx.textAlign='right';
        wheelCtx.fillStyle='#fff';
        wheelCtx.font='bold '+(wheelCv.width<300?'10':'12')+'px Poppins,sans-serif';
        wheelCtx.shadowColor='rgba(0,0,0,.6)';
        wheelCtx.shadowBlur=4;
        wheelCtx.fillText(seg.label,r-12,5);
        wheelCtx.restore();
    });
    // Center circle
    wheelCtx.beginPath();
    wheelCtx.arc(cx,cy,22,0,Math.PI*2);
    wheelCtx.fillStyle='#020010';
    wheelCtx.fill();
    wheelCtx.strokeStyle='rgba(255,255,255,.2)';
    wheelCtx.lineWidth=2;
    wheelCtx.stroke();
    wheelCtx.fillStyle='#fff';
    wheelCtx.font='bold 14px Poppins';
    wheelCtx.textAlign='center';
    wheelCtx.textBaseline='middle';
    wheelCtx.fillText('🎯',cx,cy);
}
drawWheel();

document.getElementById('spinBtn').addEventListener('click', () => {
    if (spinning) return;
    spinning=true;
    document.getElementById('spinBtn').disabled=true;
    document.getElementById('wheelResult').classList.remove('show');
    const totalRot = (Math.random()*6+8) * Math.PI*2;
    const start=performance.now(), dur=4500;
    let lastAngle=wheelAngle;
    playTone(400,'square',.06,.08);

    function anim(now) {
        const elapsed=now-start;
        const t=Math.min(elapsed/dur,1);
        const ease=1-Math.pow(1-t,4);
        wheelAngle=lastAngle+totalRot*ease;
        drawWheel(wheelAngle);
        if(t<1) { requestAnimationFrame(anim); }
        else {
            spinning=false;
            document.getElementById('spinBtn').disabled=false;
            wheelAngle=wheelAngle%(Math.PI*2);
            // Determine result
            const normalised=(((-wheelAngle%(Math.PI*2))+(Math.PI*2))%(Math.PI*2));
            const idx=Math.floor(normalised/ARC)%SEG;
            const result=WHEEL_SEGMENTS[idx];
            const resEl=document.getElementById('wheelResult');
            resEl.textContent='🎯 Your Challenge: '+result.label;
            resEl.style.borderColor=result.color;
            resEl.classList.add('show');
            playFanfare();
            confetti({particleCount:80,spread:70,origin:{y:.6},colors:[result.color,'#fff','#ffd700']});
            unlockAchievement('🎯','Wheel of Fate Spun!');
        }
    }
    requestAnimationFrame(anim);
});

// ===== KPI TASKS =====
let kpiDone=0;
function completeKPI(card) {
    if(card.classList.contains('completed')) return;
    card.classList.add('completed');
    playKPI();
    kpiDone++;
    confetti({particleCount:50,spread:55,origin:{y:.6},colors:['#00ff80','#ffd700','#6c63ff']});
    if(kpiDone===1) unlockAchievement('📋','First KPI Crushed!');
    if(kpiDone===3) unlockAchievement('⚡','Half the KPIs Done! Keep Going!');
    if(kpiDone===6) unlockAchievement('🌟','ALL KPIs COMPLETE! LEGEND!');
}

// ===== CAKE EXPLOSION =====
const cakeCanvas=document.getElementById('cakeCanvas');
const cakeCtx=cakeCanvas.getContext('2d');
let cakeParts=[], cakeAF;

function resizeCake(){cakeCanvas.width=window.innerWidth;cakeCanvas.height=window.innerHeight}
window.addEventListener('resize',resizeCake); resizeCake();

class CakePart {
    constructor(x,y){
        this.x=x; this.y=y;
        this.vx=(Math.random()-.5)*20;
        this.vy=(Math.random()-1.8)*15;
        this.alpha=1; this.r=Math.random()*12+5;
        const pal=['#ffd700','#f857a6','#6c63ff','#ff5858','#00d4ff','#a8ff78','#ff9800','#fff'];
        this.color=pal[Math.floor(Math.random()*pal.length)];
        this.shape=Math.random()>.45?'circle':'star';
        this.rot=Math.random()*Math.PI*2;
        this.rotV=(Math.random()-.5)*.3;
        this.g=.5;
    }
    update(){this.vy+=this.g;this.x+=this.vx;this.y+=this.vy;this.alpha-=.016;this.rot+=this.rotV}
    draw(c){
        c.save();c.globalAlpha=Math.max(0,this.alpha);c.fillStyle=this.color;
        c.translate(this.x,this.y);c.rotate(this.rot);
        if(this.shape==='circle'){c.beginPath();c.arc(0,0,this.r/2,0,Math.PI*2);c.fill();}
        else{
            c.beginPath();
            for(let i=0;i<5;i++){
                const a=(i*Math.PI*2)/5-Math.PI/2, b=a+Math.PI/5;
                c.lineTo(Math.cos(a)*this.r/2,Math.sin(a)*this.r/2);
                c.lineTo(Math.cos(b)*this.r*.22,Math.sin(b)*this.r*.22);
            }
            c.closePath();c.fill();
        }
        c.restore();
    }
}

function spawnBurst(x,y,n=100){for(let i=0;i<n;i++) cakeParts.push(new CakePart(x,y))}

function animCake(){
    cakeCtx.clearRect(0,0,cakeCanvas.width,cakeCanvas.height);
    cakeParts=cakeParts.filter(p=>p.alpha>0);
    cakeParts.forEach(p=>{p.update();p.draw(cakeCtx)});
    if(cakeParts.length>0) cakeAF=requestAnimationFrame(animCake);
    else{cakeCanvas.style.display='none';cancelAnimationFrame(cakeAF);}
}

let cakeClicked=false;
document.getElementById('cakeWrapper').addEventListener('click',function(){
    if(cakeClicked) return;
    cakeClicked=true;
    const candles=document.querySelectorAll('.candle');
    candles.forEach((c,i)=>setTimeout(()=>{
        c.classList.add('blown');
        playTone(300-i*20,'sine',.12,.1);
    },i*130));

    setTimeout(()=>{
        const rect=document.getElementById('cakeImg').getBoundingClientRect();
        const bx=rect.left+rect.width/2, by=rect.top+rect.height/2;
        cakeCanvas.style.display='block';
        spawnBurst(bx,by,180);
        for(let r=0;r<4;r++) setTimeout(()=>spawnBurst(bx+(Math.random()-.5)*250,by+(Math.random()-.5)*120,90),r*220);
        animCake();

        confetti({particleCount:280,spread:130,origin:{y:.65},colors:['#ffd700','#f857a6','#6c63ff','#ff5858','#fff','#00d4ff']});
        playFanfare();
        triggerCelebrationOverlay();
        document.getElementById('cakeHint').textContent='💥 WISH GRANTED! 🌟';
        unlockAchievement('🕯️','The Wish Has Been Made!');

        setTimeout(()=>{
            cakeClicked=false;
            candles.forEach(c=>c.classList.remove('blown'));
            document.getElementById('cakeHint').textContent='👆 Tap for MAGIC! 💥';
        },7000);
    }, candles.length*130+200);
});

// ===== 3D TILT CARDS =====
document.querySelectorAll('.tilt-card').forEach(card=>{
    card.addEventListener('mousemove',e=>{
        const r=card.getBoundingClientRect();
        const x=(e.clientX-r.left)/r.width -.5;
        const y=(e.clientY-r.top) /r.height-.5;
        card.style.transform=`perspective(700px) rotateX(${-y*12}deg) rotateY(${x*12}deg) translateY(-8px)`;
    });
    card.addEventListener('mouseleave',()=>{ card.style.transform=''; });
});

// ===== SCROLL REVEAL + SECTION ACHIEVEMENTS =====
const sectionAch=[
    ['.stats-section','💎','Legend Stats Discovered!'],
    ['.fun-section',  '🎭','The Chronicles Have Been Read!'],
    ['.letter-section','🌌','Future Message Located!'],
    ['.wheel-section','🎯','Found the Wheel of Fate!'],
    ['.kpi-section',  '📊','Entered the KPI Zone!'],
    ['.troll-section','😈','Entered the Danger Zone!'],
    ['.cake-section', '🎂','The Magic Cake Awaits!'],
];

document.querySelectorAll('.reveal').forEach(el=>{
    new IntersectionObserver(entries=>{
        if(entries[0].isIntersecting) entries[0].target.classList.add('visible');
    },{threshold:.1}).observe(el);
});

sectionAch.forEach(([sel,icon,name])=>{
    const node=document.querySelector(sel);
    if(!node) return;
    new IntersectionObserver(entries=>{
        if(entries[0].isIntersecting) unlockAchievement(icon,name);
    },{threshold:.25}).observe(node);
});

// ============================================================
//  PRANKS
// ============================================================

// ===== 1. FAKE LOADING SCREEN =====
(function fakeLoad() {
    const screen   = document.getElementById('loadingScreen');
    const bar      = document.getElementById('loadingBar');
    const pct      = document.getElementById('loadingPct');
    const status   = document.getElementById('loadingStatus');
    const messages = [
        'Loading birthday vibes...',
        'Inflating balloons...',
        'Baking the cake...',
        'Lighting candles...',
        'Wrapping gifts...',
        'Almost ready...',
        'Finalising swag levels...',
    ];
    let progress = 0, msgIdx = 0;

    const iv = setInterval(() => {
        // Speed up to 98, then slow crawl to 99
        const step = progress < 90 ? Math.random()*4+2 : Math.random()*.3+.05;
        progress = Math.min(progress + step, 99);
        bar.style.width = progress + '%';
        pct.textContent  = Math.floor(progress) + '%';
        if (Math.random() > .7 && msgIdx < messages.length-1) {
            status.textContent = messages[++msgIdx];
        }
        if (progress >= 99) {
            clearInterval(iv);
            pct.textContent  = '99%';
            status.textContent = '99% ... 99% ... 99%...';
            // Stuck at 99 — classic prank
            setTimeout(() => {
                status.innerHTML = '<span class="loading-gotcha">Just kidding, it was already loaded! 😂🎉</span>';
                bar.style.width = '100%';
                pct.textContent = '100%';
                setTimeout(() => screen.classList.add('hidden'), 1200);
            }, 2800);
        }
    }, 80);
})();

// ===== 2. WINDOWS XP ERROR (fires after ~25s) =====
setTimeout(() => {
    document.getElementById('winError').classList.add('show');
    playTone(220,'square',.5,.08);
    playTone(220,'square',.5,.08,.55);
    unlockAchievement('🪟','Windows Birthday Error!');
}, 25000);

function closeWinError() {
    document.getElementById('winError').classList.remove('show');
    playSad();
}

// ===== 3. BIRTHDAY VIRUS ALERT (fires after ~18s) =====
setTimeout(() => {
    document.getElementById('virusAlert').classList.add('show');
    playTone(440,'sawtooth',.3,.07);
    unlockAchievement('🦠','Infected with Birthday Fever!');
}, 18000);

function closeVirus() {
    document.getElementById('virusAlert').classList.remove('show');
}

// ===== 4. AFK DETECTOR =====
let afkTimer, afkSeconds = 0, afkInterval;
function resetAfk() {
    clearTimeout(afkTimer);
    clearInterval(afkInterval);
    afkSeconds = 0;
    afkTimer = setTimeout(triggerAfk, 22000);
}
function triggerAfk() {
    const popup = document.getElementById('afkPopup');
    const secEl = document.getElementById('afkSeconds');
    afkSeconds = 0;
    popup.classList.add('show');
    playTone(500,'square',.15,.1);
    playTone(500,'square',.15,.1,.2);
    afkInterval = setInterval(() => {
        afkSeconds++;
        secEl.textContent = afkSeconds;
        if (afkSeconds % 5 === 0) playTone(400,'square',.08,.08);
    }, 1000);
    unlockAchievement('😴','Caught Slacking!');
}
function closeAfk() {
    document.getElementById('afkPopup').classList.remove('show');
    clearInterval(afkInterval);
    resetAfk();
}
['mousemove','keydown','click','scroll','touchstart'].forEach(e => document.addEventListener(e, resetAfk, {passive:true}));
resetAfk();

// ===== 5. KONAMI CODE =====
const KONAMI = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
let konamiIdx = 0;
document.addEventListener('keydown', e => {
    if (e.key === KONAMI[konamiIdx]) {
        konamiIdx++;
        playBlip();
        if (konamiIdx === KONAMI.length) {
            konamiIdx = 0;
            document.getElementById('konamiOverlay').classList.add('active');
            playFanfare();
            setTimeout(() => {
                confetti({particleCount:400,spread:160,origin:{y:.5},colors:['#ffd700','#f857a6','#6c63ff','#ff5858','#fff','#00d4ff']});
            }, 200);
            unlockAchievement('🎮','KONAMI CODE MASTER!');
        }
    } else {
        konamiIdx = 0;
    }
});
function closeKonami() { document.getElementById('konamiOverlay').classList.remove('active'); }

// ===== 6. COPY PRANK =====
document.addEventListener('copy', e => {
    e.preventDefault();
    const funny = 'I hereby solemnly declare that Talha Kashif is the most legendary birthday person to ever exist. Signed: The Universe 🌌🎂';
    if (e.clipboardData) {
        e.clipboardData.setData('text/plain', funny);
    } else if (navigator.clipboard) {
        navigator.clipboard.writeText(funny);
    }
    showDblToast('📋 Clipboard hijacked! Talha\'s propaganda installed. 😂');
    playTone(800,'square',.08,.07);
});

// ===== 7. FAKE INCOMING CALL (fires after ~12s) =====
setTimeout(() => {
    const call = document.getElementById('fakeCall');
    call.classList.add('ringing');
    playTone(880,'square',.3,.1);
    setTimeout(()=>playTone(880,'square',.3,.1),.7);
    unlockAchievement('📞','Missed Call from the Future!');

    // Auto dismiss after 8s if ignored
    setTimeout(() => {
        if (call.classList.contains('ringing')) {
            call.classList.remove('ringing');
            document.getElementById('callStatus').textContent = 'Call Missed 📵';
            setTimeout(() => call.classList.remove('ringing'), 100);
        }
    }, 8000);
}, 12000);

function answerCall() {
    const call = document.getElementById('fakeCall');
    document.getElementById('callStatus').textContent = 'Connected... 🔊';
    playTone(1000,'sine',.2,.08);
    setTimeout(() => {
        document.getElementById('callStatus').textContent = '"Happy Birthday bro... also, don\'t eat the last slice. Bye!" 📵';
        setTimeout(() => call.classList.remove('ringing'), 3000);
    }, 1200);
    unlockAchievement('👻','Answered the Future Call!');
}
function declineCall() {
    const call = document.getElementById('fakeCall');
    call.classList.remove('ringing');
    playSad();
    showDblToast('😤 You declined a call from the FUTURE. Brave choice.');
}

// ===== 8. RAGE QUIT =====
function rageQuit() {
    // Shake page
    document.body.classList.remove('shaking');
    void document.body.offsetWidth;
    document.body.classList.add('shaking');
    setTimeout(() => document.body.classList.remove('shaking'), 650);
    playTone(100,'sawtooth',.6,.15);

    // Then show popup
    setTimeout(() => {
        document.getElementById('ragePopup').classList.add('show');
        confetti({particleCount:120,spread:100,origin:{y:.5},colors:['#ff5858','#ffd700','#6c63ff']});
        unlockAchievement('💢','Tried to Rage Quit! Nice Try!');
    }, 700);
}
function closeRage() { document.getElementById('ragePopup').classList.remove('show'); }

// ===== 9. FAKE CERTIFICATE DOWNLOAD =====
function fakeCertificate() {
    showDblToast('📜 Preparing Official Certificate...');
    playTone(600,'sine',.12,.08);

    const steps = [
        [800,  '📜 Verifying birthday credentials...'],
        [1800, '🖨️ Printing on gold-embossed paper...'],
        [3000, '✍️ Getting royal signatures...'],
        [4200, '🔏 Applying holographic seal...'],
        [5400, '🚀 Launching delivery rocket...'],
        [6800, '💥 Rocket crashed. But certificate survived! 😂'],
    ];
    steps.forEach(([delay, msg]) => setTimeout(() => showDblToast(msg), delay));

    setTimeout(() => {
        const W = 1400, H = 990;
        const cv = document.createElement('canvas');
        cv.width = W; cv.height = H;
        const ctx = cv.getContext('2d');

        // Parchment background
        const bgGrad = ctx.createLinearGradient(0,0,W,H);
        bgGrad.addColorStop(0,'#fffdf0'); bgGrad.addColorStop(0.4,'#fff8dc');
        bgGrad.addColorStop(0.7,'#fef5cc'); bgGrad.addColorStop(1,'#fdf0bb');
        ctx.fillStyle = bgGrad; ctx.fillRect(0,0,W,H);
        for(let i=0;i<4000;i++){
            ctx.fillStyle=`rgba(${Math.random()>.5?180:220},${Math.random()>.5?160:200},80,${Math.random()*.06})`;
            ctx.fillRect(Math.random()*W,Math.random()*H,Math.random()*3+1,Math.random()*3+1);
        }

        // Gold gradient helper
        function goldGrad(x1,y1,x2,y2){
            const g=ctx.createLinearGradient(x1,y1,x2,y2);
            g.addColorStop(0,'#b8860b'); g.addColorStop(.25,'#ffd700');
            g.addColorStop(.5,'#ffec80'); g.addColorStop(.75,'#ffd700');
            g.addColorStop(1,'#b8860b'); return g;
        }

        // Borders
        ctx.strokeStyle=goldGrad(0,0,W,0); ctx.lineWidth=14; ctx.strokeRect(18,18,W-36,H-36);
        ctx.strokeStyle=goldGrad(0,0,W,0); ctx.lineWidth=4;  ctx.strokeRect(36,36,W-72,H-72);
        ctx.strokeStyle=goldGrad(0,0,W,0); ctx.lineWidth=1.5;ctx.strokeRect(44,44,W-88,H-88);

        // Corner rosettes
        function rosette(cx,cy){
            ctx.save(); ctx.translate(cx,cy);
            for(let i=0;i<12;i++){
                ctx.save(); ctx.rotate(i*Math.PI/6);
                const rg=ctx.createRadialGradient(0,-22,2,0,-22,12);
                rg.addColorStop(0,'#ffec80'); rg.addColorStop(1,'#b8860b');
                ctx.fillStyle=rg; ctx.beginPath();
                ctx.ellipse(0,-22,7,12,0,0,2*Math.PI); ctx.fill(); ctx.restore();
            }
            const cg=ctx.createRadialGradient(0,0,2,0,0,20);
            cg.addColorStop(0,'#ffec80'); cg.addColorStop(1,'#b8860b');
            ctx.fillStyle=cg; ctx.beginPath(); ctx.arc(0,0,20,0,2*Math.PI); ctx.fill();
            ctx.strokeStyle='#b8860b'; ctx.lineWidth=1.5; ctx.stroke(); ctx.restore();
        }
        rosette(30,30); rosette(W-30,30); rosette(30,H-30); rosette(W-30,H-30);

        // Watermark
        ctx.save(); ctx.globalAlpha=.07; ctx.translate(W/2,H/2); ctx.rotate(-Math.PI/6);
        ctx.font='bold 160px Georgia,serif'; ctx.fillStyle='#8B6914';
        ctx.textAlign='center'; ctx.textBaseline='middle';
        ctx.fillText('CERTIFIED',0,0); ctx.restore();

        // Header seal
        const sX=W/2,sY=118,sR=62;
        for(let i=0;i<36;i++){
            const a=i*Math.PI/18;
            ctx.fillStyle=goldGrad(sX+sR*Math.cos(a),sY+sR*Math.sin(a),sX+(sR+10)*Math.cos(a),sY+(sR+10)*Math.sin(a));
            ctx.beginPath();
            ctx.moveTo(sX+sR*Math.cos(a),sY+sR*Math.sin(a));
            ctx.lineTo(sX+(sR+10)*Math.cos(a+.04),sY+(sR+10)*Math.sin(a+.04));
            ctx.lineTo(sX+(sR+10)*Math.cos(a+.09),sY+(sR+10)*Math.sin(a+.09));
            ctx.lineTo(sX+sR*Math.cos(a+.13),sY+sR*Math.sin(a+.13));
            ctx.closePath(); ctx.fill();
        }
        const dg=ctx.createRadialGradient(sX-10,sY-10,5,sX,sY,sR);
        dg.addColorStop(0,'#8B0000'); dg.addColorStop(1,'#4a0000');
        ctx.fillStyle=dg; ctx.beginPath(); ctx.arc(sX,sY,sR,0,2*Math.PI); ctx.fill();
        // Star inside seal
        ctx.beginPath();
        for(let i=0;i<10;i++){
            const a2=i*Math.PI/5-Math.PI/2, r2=i%2===0?42:20;
            i===0?ctx.moveTo(sX+r2*Math.cos(a2),sY+r2*Math.sin(a2)):ctx.lineTo(sX+r2*Math.cos(a2),sY+r2*Math.sin(a2));
        }
        ctx.closePath(); ctx.fillStyle='#ffd700'; ctx.fill();
        ctx.save(); ctx.translate(sX,sY); ctx.font='bold 9px Arial'; ctx.fillStyle='#fff';
        ctx.textAlign='center'; ctx.fillText('BIRTHDAY',0,-14); ctx.fillText('BUREAU™',0,-2); ctx.restore();

        // Horizontal gold divider
        function hLine(y,x1=60,x2=W-60){
            const lg=ctx.createLinearGradient(x1,y,x2,y);
            lg.addColorStop(0,'rgba(184,134,11,0)'); lg.addColorStop(.2,'#ffd700');
            lg.addColorStop(.5,'#ffec80'); lg.addColorStop(.8,'#ffd700');
            lg.addColorStop(1,'rgba(184,134,11,0)');
            ctx.strokeStyle=lg; ctx.lineWidth=1.5; ctx.beginPath(); ctx.moveTo(x1,y); ctx.lineTo(x2,y); ctx.stroke();
        }

        // Header text
        ctx.textAlign='center'; ctx.fillStyle='#7a5c00';
        ctx.font='italic bold 15px Georgia,serif';
        ctx.fillText('✦  THE BIRTHDAY BUREAU  ✦',W/2,66);
        ctx.font='bold 36px Georgia,serif'; ctx.fillStyle='#4a3000';
        ctx.fillText('OFFICIAL CERTIFICATE OF EXCELLENCE',W/2,205);
        hLine(225,120,W-120);

        // Body
        ctx.font='italic 24px Georgia,serif'; ctx.fillStyle='#5a4000';
        ctx.fillText('This is to certify that',W/2,280);

        // Name
        const ng=ctx.createLinearGradient(300,0,W-300,0);
        ng.addColorStop(0,'#8B6914'); ng.addColorStop(.3,'#DAA520');
        ng.addColorStop(.5,'#FFD700'); ng.addColorStop(.7,'#DAA520'); ng.addColorStop(1,'#8B6914');
        ctx.font='bold 88px "Dancing Script",Georgia,serif'; ctx.fillStyle=ng;
        ctx.fillText('Talha Kashif',W/2,378);
        hLine(408,200,W-200);

        ctx.font='italic 20px Georgia,serif'; ctx.fillStyle='#5a4000';
        ctx.fillText('has successfully completed another lap around the sun and is hereby awarded',W/2,450);
        ctx.fillText('the following honours by unanimous decree of The Birthday Bureau:',W/2,480);

        // Award badges
        const awards=[
            {icon:'🏆',title:'LEGENDARY HUMAN STATUS',         sub:'Certified by the Bureau of Outstanding Individuals'},
            {icon:'💎',title:'MAXIMUM SWAG CERTIFICATION',     sub:'Swag levels measured and confirmed off the charts'},
            {icon:'🔥',title:'CERTIFIED BIRTHDAY SURVIVOR',    sub:'Survived another year of absolute chaos — flawlessly'},
            {icon:'👑',title:'ELITE FRIEND TIER — PLATINUM',   sub:'Recognised as premium friend material, no returns'},
        ];
        const colW=(W-160)/2;
        awards.forEach((aw,i)=>{
            const col=i%2, row=Math.floor(i/2);
            const ax=80+col*colW+colW/2, ay=530+row*125;
            ctx.save(); ctx.globalAlpha=.55;
            const bg=ctx.createLinearGradient(ax-colW/2+10,ay-30,ax+colW/2-10,ay+70);
            bg.addColorStop(0,'rgba(184,134,11,.35)'); bg.addColorStop(1,'rgba(255,215,0,.12)');
            ctx.fillStyle=bg; ctx.beginPath();
            ctx.roundRect(ax-colW/2+14,ay-40,colW-28,100,12); ctx.fill();
            ctx.globalAlpha=1; ctx.strokeStyle='rgba(184,134,11,.5)'; ctx.lineWidth=1; ctx.stroke(); ctx.restore();
            ctx.font='32px serif'; ctx.textAlign='center'; ctx.fillText(aw.icon,ax,ay+2);
            ctx.font='bold 17px Georgia,serif'; ctx.fillStyle='#4a3000'; ctx.fillText(aw.title,ax,ay+28);
            ctx.font='italic 13px Georgia,serif'; ctx.fillStyle='#7a5c00'; ctx.fillText(aw.sub,ax,ay+48);
        });

        hLine(800,120,W-120);

        // Left signature
        ctx.font='italic bold 28px "Dancing Script",Georgia,serif'; ctx.fillStyle='#1a0a6b'; ctx.textAlign='center';
        ctx.fillText('Aqib Ejaz',300,870);
        ctx.font='13px Georgia,serif'; ctx.fillStyle='#7a5c00';
        ctx.fillText('Your Buddy & Best Wisher',300,892); ctx.fillText('Certified Birthday Planner™',300,910);
        ctx.strokeStyle='#b8860b'; ctx.lineWidth=1;
        ctx.beginPath(); ctx.moveTo(160,852); ctx.lineTo(440,852); ctx.stroke();

        // Center date stamp
        const dX=W/2,dY=875;
        ctx.beginPath(); ctx.arc(dX,dY,52,0,2*Math.PI); ctx.strokeStyle='#b8860b'; ctx.lineWidth=2; ctx.stroke();
        ctx.beginPath(); ctx.arc(dX,dY,44,0,2*Math.PI); ctx.lineWidth=.8; ctx.stroke();
        ctx.font='bold 12px Georgia,serif'; ctx.fillStyle='#4a3000';
        ctx.textAlign='center'; ctx.textBaseline='middle';
        ctx.fillText('ISSUED',dX,dY-18); ctx.font='bold 15px Georgia,serif';
        ctx.fillText('Sep 2026',dX,dY); ctx.font='11px Georgia,serif';
        ctx.fillText('Cert No. TK-2026-001',dX,dY+18); ctx.textBaseline='alphabetic';

        // Right signature
        ctx.font='italic bold 28px "Dancing Script",Georgia,serif'; ctx.fillStyle='#8b0000';
        ctx.fillText('The Birthday Bureau™',W-300,870);
        ctx.font='13px Georgia,serif'; ctx.fillStyle='#7a5c00';
        ctx.fillText('Official Authorising Body',W-300,892);
        ctx.fillText('Universe Division, Sector 7G',W-300,910);
        ctx.strokeStyle='#b8860b'; ctx.lineWidth=1;
        ctx.beginPath(); ctx.moveTo(W-460,852); ctx.lineTo(W-140,852); ctx.stroke();

        // Fine print
        ctx.font='11px Georgia,serif'; ctx.fillStyle='rgba(120,90,0,.6)'; ctx.textAlign='center';
        ctx.fillText('This certificate is 100% real and legally binding in 47 galaxies (but not on Earth). Valid for one year. Happy Birthday! 🎉',W/2,H-26);

        cv.toBlob(blob=>{
            const a=document.createElement('a');
            a.href=URL.createObjectURL(blob);
            a.download='TalhaKashif_OfficialBirthdayCertificate.png';
            a.click();
            showDblToast('🎉 Certificate downloaded! Frame it on your wall!');
            unlockAchievement('📜','Certificate Downloaded!');
        },'image/png');
    }, 7500);
}

// ===== DOUBLE CLICK PRANK =====
const dblMsgs = [
    '⚠️ Error 404: Too much fun detected. Please pace yourself.',
    '🖱️ Double-click detected. Birthday authorities have been notified.',
    '😂 Illegal move! Double-clicking is banned on birthdays.',
    '🎂 Error: Fun.exe is already running at 100%.',
    '🚨 ALERT: Your clicking speed exceeds the birthday speed limit.',
];
let dblIdx = 0;
document.addEventListener('dblclick', () => {
    showDblToast(dblMsgs[dblIdx % dblMsgs.length]);
    dblIdx++;
    playTone(600,'square',.07,.07);
});

// ===== TOAST HELPER =====
let dblToastTimer;
function showDblToast(msg) {
    const el = document.getElementById('dblToast');
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(dblToastTimer);
    dblToastTimer = setTimeout(() => el.classList.remove('show'), 3500);
}
