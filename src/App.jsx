import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { proposalConfig } from './config';

export default function App() {
  const [status, setStatus] = useState('precheck'); // 'precheck' | 'single' | 'taken'
  const [isPlaying, setIsPlaying] = useState(false);
  const [noCount, setNoCount] = useState(0);
  const [noBtnOffset, setNoBtnOffset] = useState({ x: 0, y: 0 });
  const [showModal, setShowModal] = useState(false);

  const audioRef = useRef(null);
  const canvasRef = useRef(null);

  // Background audio control
  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  // Runaway button for 'No'
  const handleNoInteraction = (e) => {
    e.preventDefault();
    setNoCount((prev) => prev + 1);
    const x = (Math.random() - 0.5) * 220;
    const y = (Math.random() - 0.5) * 140;
    setNoBtnOffset({ x, y });
  };

  const getNoText = () => {
    if (noCount === 0) return "Hmm, coba pikir dulu...";
    const texts = proposalConfig.responses.playfulNoTexts;
    return texts[(noCount - 1) % texts.length];
  };

  const handleYes = () => {
    setShowModal(true);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const handleSelectSingle = () => {
    setStatus('single');
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.5 }
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectTaken = () => {
    setStatus('taken');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToPrecheck = () => {
    setStatus('precheck');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Ambient Particles Effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const particles = Array.from({ length: 45 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2.5 + 0.5,
      speedY: Math.random() * 0.4 + 0.1,
      speedX: (Math.random() - 0.5) * 0.3,
      opacity: Math.random() * 0.6 + 0.2
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p) => {
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
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const encodedMsgYes = encodeURIComponent(proposalConfig.responses.whatsappMessage);
  const waUrlYes = `https://wa.me/${proposalConfig.responses.whatsappNumber}?text=${encodedMsgYes}`;

  const encodedMsgTaken = encodeURIComponent(
    "Hai Taufiiq! Aku Balqis... Aku udah buka link webnya yaa. Makasih banyak yaa atas niat baiknya! 🙏"
  );
  const waUrlTaken = `https://wa.me/${proposalConfig.responses.whatsappNumber}?text=${encodedMsgTaken}`;

  return (
    <div className="app-container">
      {/* Ambient Lights & Particles */}
      <div className="ambient-light ambient-1" />
      <div className="ambient-light ambient-2" />
      <div className="ambient-light ambient-3" />
      <canvas ref={canvasRef} id="canvas-particles" />

      {/* Floating Music Button */}
      <audio ref={audioRef} src={proposalConfig.music.audioSrc} loop />
      <button className="music-toggle-btn" onClick={toggleMusic} title="Putar / Jeda Musik">
        <div className={`music-wave ${!isPlaying ? 'paused' : ''}`}>
          <span />
          <span />
          <span />
        </div>
        <span>{isPlaying ? `${proposalConfig.music.title} - ${proposalConfig.music.artist}` : 'Putar Musik 🎵'}</span>
      </button>

      {/* Main Container */}
      <main className="container">
        {/* VIEW 1: Pre-Check Gate */}
        {status === 'precheck' && (
          <section className="glass-card precheck-card">
            <div className="hero-badge">Quick Question Dulu Nih ✌️</div>
            <h1 className="precheck-title">Haloo, {proposalConfig.herName}!</h1>
            <p className="precheck-desc">
              Sebelum lanjut baca yang udah aku siapin, aku mau nanya santai dulu nih biar sama-sama enak dan ga salah tempat hehe.
            </p>

            <div className="status-question-box">
              <h3>Sekarang kamu lagi deket sama seseorang atau lagi sendiri nih? Hehe</h3>
              <p className="status-hint">Jawab santai aja yaa, no pressure sama sekali! :D</p>

              <div className="status-buttons">
                <button className="status-btn btn-single" onClick={handleSelectSingle}>
                  <span className="btn-icon">✨</span>
                  <div className="btn-content">
                    <strong>Lagi sendiri kok haha</strong>
                    <small>Lagi santuy & free kok</small>
                  </div>
                </button>

                <button className="status-btn btn-taken" onClick={handleSelectTaken}>
                  <span className="btn-icon">🙈</span>
                  <div className="btn-content">
                    <strong>Lagi deket sama seseorang</strong>
                    <small>Udah ada yang nemenin</small>
                  </div>
                </button>
              </div>
            </div>
          </section>
        )}

        {/* VIEW 2: Taken Response */}
        {status === 'taken' && (
          <section className="glass-card taken-response-card">
            <div className="modal-icon">🙌</div>
            <h2 className="taken-title">Aman banget, {proposalConfig.nicknames.her}!</h2>
            <p className="taken-desc">
              Makasih yaa udah jujur dan mau sempetin buka link ini. Respect banget! Langgeng dan lancar terus yaa buat kamu sama cowokmu, have a good day! ✨
            </p>
            <div className="taken-signature">— {proposalConfig.yourName}</div>
            <div style={{ marginTop: '24px', display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <a
                href={waUrlTaken}
                target="_blank"
                rel="noreferrer"
                className="modal-action-btn"
                style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}
              >
                <span>Kabarin Taufiiq via WhatsApp 💬</span>
              </a>
              <button
                className="modal-action-btn"
                onClick={handleBackToPrecheck}
                style={{ background: 'transparent', border: '1px dashed rgba(255,255,255,0.25)', color: '#a8a29e', cursor: 'pointer' }}
              >
                <span>← Balik ke Pilihan Awal</span>
              </button>
            </div>
          </section>
        )}

        {/* VIEW 3: Proposal Full Content (Single) */}
        {status === 'single' && (
          <div id="proposal-full-content">
            {/* Welcome Banner */}
            <section className="glass-card welcome-banner">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span className="section-tag" style={{ marginBottom: 0 }}>Alhamdulillah aman wkwk 🙌</span>
                <button
                  onClick={handleBackToPrecheck}
                  style={{ background: 'transparent', border: 'none', color: '#a8a29e', fontSize: '0.82rem', cursor: 'pointer', textDecoration: 'underline' }}
                >
                  ← Ubah Jawaban
                </button>
              </div>
              <h2 className="section-title">Syukurlah kalau kosong haha...</h2>
              <p className="welcome-text">
                Berarti aku ga salah tempat nih. Nah karena hatimu lagi free, ada sesuatu yang udah aku siapin dan pengen aku obrolin serius tapi santai sama kamu. Scroll pelan-pelan yaa! 👇
              </p>
            </section>

            {/* Timeline */}
            <section className="glass-card" id="story-section">
              <div className="section-header">
                <span className="section-tag">Our Journey So Far</span>
                <h2 className="section-title">Cerita Singkat Kita</h2>
              </div>
              <div className="timeline-container">
                <div className="timeline-line" />
                <div id="timeline-list">
                  {proposalConfig.timeline.map((item, idx) => (
                    <div key={idx} className="timeline-item">
                      <div className="timeline-dot" />
                      <span className="timeline-badge">{item.badge} • {item.date}</span>
                      <h4>{item.title}</h4>
                      <p>{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Roadmap / Pillars */}
            <section className="glass-card" id="roadmap-section">
              <div className="section-header">
                <span className="section-tag">Vision & Values</span>
                <h2 className="section-title">Arah & Niat Baik yang Kusiapkan</h2>
              </div>
              <div className="roadmap-grid">
                {proposalConfig.roadmap.map((pillar, idx) => (
                  <div key={idx} className="roadmap-card">
                    <span className="roadmap-number">PILLAR 0{idx + 1}</span>
                    <h4>{pillar.title}</h4>
                    <p>{pillar.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Personal Letter */}
            <section className="glass-card letter-box" id="letter-section">
              <h3 className="letter-greeting">{proposalConfig.letter.greeting} {proposalConfig.nicknames.her},</h3>
              <div id="letter-paragraphs">
                {proposalConfig.letter.paragraphs.map((p, idx) => (
                  <p key={idx} className="letter-paragraph">{p}</p>
                ))}
              </div>
              <div className="letter-closing">{proposalConfig.letter.closing}</div>
              <div className="letter-sender">{proposalConfig.letter.sender}</div>
            </section>

            {/* Proposal Question Action */}
            <section className="glass-card proposal-box">
              <h2 className="proposal-question">Would you walk with me into this journey?</h2>
              <p className="proposal-subtext">
                Membangun komitmen saling mengenal dengan niat yang jelas menuju pernikahan (Date to Marry).
              </p>

              <div className="actions-group">
                <button
                  className="btn btn-yes"
                  onClick={handleYes}
                  style={{ transform: `scale(${Math.min(1 + noCount * 0.08, 1.4)})` }}
                >
                  <span>Yes, I will ❤️</span>
                </button>
                <button
                  className="btn btn-no"
                  onMouseEnter={handleNoInteraction}
                  onClick={handleNoInteraction}
                  style={{
                    transform: `translate(${noBtnOffset.x}px, ${noBtnOffset.y}px)`,
                    transition: 'transform 0.25s ease'
                  }}
                >
                  <span>{getNoText()}</span>
                </button>
              </div>
            </section>
          </div>
        )}
      </main>

      {/* Success Modal */}
      {showModal && (
        <div className="modal-overlay active">
          <div className="modal-card">
            <div className="modal-icon">💍✨</div>
            <h3 className="modal-title">{proposalConfig.responses.acceptedTitle}</h3>
            <p className="modal-text">{proposalConfig.responses.acceptedMessage}</p>
            <a href={waUrlYes} target="_blank" rel="noreferrer" className="modal-action-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z" />
              </svg>
              <span>Kirim Kabar Baik ke WhatsApp</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
