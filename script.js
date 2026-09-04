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
