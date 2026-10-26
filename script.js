document.addEventListener('DOMContentLoaded', () => {
  const config = window.PROPOSAL_CONFIG;
  if (!config) return;

  // 1. Populate Personal Content
  document.getElementById('her-name-hero').textContent = config.herName;
  document.getElementById('sender-name').textContent = config.letter.sender;
  document.getElementById('letter-greeting').textContent = `${config.letter.greeting} ${config.herName},`;

  // Pre-Check Logic
  const precheckSection = document.getElementById('precheck-section');
  const takenResponseSection = document.getElementById('taken-response-section');
  const proposalFullContent = document.getElementById('proposal-full-content');
  const btnStatusSingle = document.getElementById('btn-status-single');
  const btnStatusTaken = document.getElementById('btn-status-taken');
  const btnBackFromTaken = document.getElementById('btn-back-from-taken');
  const btnBackFromSingle = document.getElementById('btn-back-from-single');

  btnStatusSingle.addEventListener('click', () => {
    precheckSection.style.display = 'none';
    proposalFullContent.style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
    triggerConfetti();
  });

  btnStatusTaken.addEventListener('click', () => {
    precheckSection.style.display = 'none';
    takenResponseSection.style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Kembali ke pertanyaan awal
  function backToPrecheck() {
    takenResponseSection.style.display = 'none';
    proposalFullContent.style.display = 'none';
    precheckSection.style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  if (btnBackFromTaken) btnBackFromTaken.addEventListener('click', backToPrecheck);
  if (btnBackFromSingle) btnBackFromSingle.addEventListener('click', backToPrecheck);

  // Letter Paragraphs
  const letterContainer = document.getElementById('letter-paragraphs');
  letterContainer.innerHTML = '';
  config.letter.paragraphs.forEach(p => {
    const el = document.createElement('p');
    el.className = 'letter-paragraph';
    el.textContent = p;
    letterContainer.appendChild(el);
  });

  // Timeline
  const timelineList = document.getElementById('timeline-list');
  timelineList.innerHTML = '';
  config.timeline.forEach((item, index) => {
    const el = document.createElement('div');
    el.className = 'timeline-item';
    el.innerHTML = `
      <div class="timeline-dot"></div>
      <span class="timeline-badge">${item.badge} • ${item.date}</span>
      <h4>${item.title}</h4>
      <p>${item.desc}</p>
    `;
    timelineList.appendChild(el);
  });

  // Roadmap Grid
  const roadmapGrid = document.getElementById('roadmap-grid');
  roadmapGrid.innerHTML = '';
  config.roadmap.forEach((item, idx) => {
    const card = document.createElement('div');
    card.className = 'roadmap-card';
    card.innerHTML = `
      <span class="roadmap-number">PILLAR 0${idx + 1}</span>
      <h4>${item.title}</h4>
      <p>${item.desc}</p>
    `;
    roadmapGrid.appendChild(card);
  });

  // 2. Music Player
  const bgAudio = document.getElementById('bg-music');
  const musicToggle = document.getElementById('music-toggle');
  const musicWave = document.querySelector('.music-wave');
  const musicLabel = document.getElementById('music-label');

  if (config.music && config.music.audioSrc) {
    bgAudio.src = config.music.audioSrc;
  }

  let isPlaying = false;
  function toggleMusic() {
    if (isPlaying) {
      bgAudio.pause();
      musicWave.classList.add('paused');
      musicLabel.textContent = 'Play Music';
      isPlaying = false;
    } else {
      bgAudio.play().then(() => {
        musicWave.classList.remove('paused');
        musicLabel.textContent = `${config.music.title}`;
        isPlaying = true;
      }).catch(() => {
        console.log("Autoplay was prevented by browser policy.");
      });
    }
  }

  musicToggle.addEventListener('click', toggleMusic);

  // Play music on first interaction anywhere
  document.body.addEventListener('click', function startAudioOnce() {
    if (!isPlaying && bgAudio.src) {
      bgAudio.play().then(() => {
        isPlaying = true;
        musicWave.classList.remove('paused');
        musicLabel.textContent = `${config.music.title}`;
      }).catch(() => {});
    }
  }, { once: true });

  // 3. Interactive Buttons (Yes & Playful Runaway No)
  const yesBtn = document.getElementById('btn-yes');
  const noBtn = document.getElementById('btn-no');
  const modalOverlay = document.getElementById('success-modal');
  const modalTitle = document.getElementById('modal-title');
  modalDesc = document.getElementById('modal-desc');
  const waBtn = document.getElementById('wa-btn');
  const waBtnTaken = document.getElementById('wa-btn-taken');

  modalTitle.textContent = config.responses.acceptedTitle;
  modalDesc.textContent = config.responses.acceptedMessage;

  const encodedMsgYes = encodeURIComponent(config.responses.whatsappMessage);
  waBtn.href = `https://wa.me/${config.responses.whatsappNumber}?text=${encodedMsgYes}`;

  const encodedMsgTaken = encodeURIComponent("Hai Taufiiq! Aku Balqis... Aku udah buka link webnya yaa. Makasih banyak yaa atas niat baiknya! 🙏");
  if (waBtnTaken) {
    waBtnTaken.href = `https://wa.me/${config.responses.whatsappNumber}?text=${encodedMsgTaken}`;
  }

  yesBtn.addEventListener('click', () => {
    modalOverlay.classList.add('active');
    triggerConfetti();
  });

  // Playful No Button behavior
  let noClickCount = 0;
  noBtn.addEventListener('mouseover', moveNoButton);
  noBtn.addEventListener('click', (e) => {
    e.preventDefault();
    moveNoButton();
  });

  function moveNoButton() {
    noClickCount++;
    const texts = config.responses.playfulNoTexts;
    noBtn.textContent = texts[(noClickCount - 1) % texts.length];

    // Move button randomly within viewport
    const x = (Math.random() - 0.5) * 200;
    const y = (Math.random() - 0.5) * 120;
    noBtn.style.transform = `translate(${x}px, ${y}px)`;

    // Yes button gets bigger & more prominent
    const currentScale = 1 + (noClickCount * 0.08);
    yesBtn.style.transform = `scale(${Math.min(currentScale, 1.4)})`;
  }

  // 4. Ambient Sparkles Canvas
  initCanvas();
});

// Canvas Particle Effect
function initCanvas() {
  const canvas = document.getElementById('canvas-particles');
  const ctx = canvas.getContext('2d');

  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  const particleCount = 45;

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2.5 + 0.5,
      speedY: Math.random() * 0.4 + 0.1,
      speedX: (Math.random() - 0.5) * 0.3,
      opacity: Math.random() * 0.6 + 0.2
    });
  }

  function render() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(251, 113, 133, ${p.opacity})`;
      ctx.fill();

      p.y -= p.speedY;
      p.x += p.speedX;

      if (p.y < 0) p.y = height;
      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
    });

    requestAnimationFrame(render);
  }

  render();
}

// Simple celebration confetti
function triggerConfetti() {
  const count = 100;
  const defaults = {
    origin: { y: 0.7 }
  };

  for (let i = 0; i < 40; i++) {
    const el = document.createElement('div');
    el.style.position = 'fixed';
    el.style.zIndex = '1000';
    el.style.width = Math.random() * 10 + 6 + 'px';
    el.style.height = Math.random() * 10 + 6 + 'px';
    el.style.backgroundColor = ['#f43f5e', '#fb7185', '#fda4af', '#f59e0b', '#ffffff'][Math.floor(Math.random() * 5)];
    el.style.borderRadius = '50%';
    el.style.top = '50%';
    el.style.left = '50%';
    el.style.pointerEvents = 'none';
    el.style.transition = 'all 1.2s cubic-bezier(0.1, 1, 0.1, 1)';
    
    document.body.appendChild(el);

    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * 350 + 100;
    const destX = Math.cos(angle) * distance;
    const destY = Math.sin(angle) * distance;

    setTimeout(() => {
      el.style.transform = `translate(${destX}px, ${destY}px) scale(0)`;
      el.style.opacity = '0';
    }, 20);

    setTimeout(() => {
      el.remove();
    }, 1300);
  }
}
