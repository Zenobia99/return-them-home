// Detonation intro, ported from return-them-home-lite: splash still with a
// pulsing button on the dome; pressing it plays the 5s explosion video, then
// reveals the 3D experience (which loads underneath while the splash is up).
// Runs on fresh page loads only — the in-app Reset never replays it.

const BASE = import.meta.env.BASE_URL;

export function runIntro() {
  const splash = document.getElementById('splash');
  const video = document.getElementById('intro-video');
  const skip = document.getElementById('skip');
  const domeBtn = document.getElementById('domeBtn');
  const ui = document.getElementById('ui');

  ui.classList.add('hidden'); // no app buttons behind the splash
  splash.style.backgroundImage = `url(${BASE}splash.jpg)`;
  video.src = `${BASE}intro.mp4`;

  let done = false;
  function reveal() {
    if (done) return;
    done = true;
    video.pause();
    video.classList.add('hidden');
    skip.classList.add('hidden');
    splash.classList.add('hidden');
    ui.classList.remove('hidden');
  }

  function play() {
    splash.classList.add('hidden');
    video.classList.remove('hidden');
    skip.classList.remove('hidden');
    video.onended = reveal;
    video.onerror = reveal; // missing/broken video -> straight to the app
    setTimeout(reveal, 8000); // safety fallback
    try {
      const p = video.play();
      if (p && p.catch) p.catch(() => {
        video.muted = true;
        video.play().catch(reveal);
      });
    } catch (e) {
      reveal();
    }
  }

  // Pin the button to the dome in splash.jpg. center/cover maps image point
  // (ix, iy) in the 1280x720 still to viewport centre + offset * cover scale.
  function placeDomeBtn() {
    const iw = 1280, ih = 720, ix = 620, iy = 132;
    const s = Math.max(innerWidth / iw, innerHeight / ih);
    domeBtn.style.left = innerWidth / 2 + (ix - iw / 2) * s + 'px';
    domeBtn.style.top = innerHeight / 2 + (iy - ih / 2) * s + 'px';
  }
  placeDomeBtn();
  addEventListener('resize', placeDomeBtn);

  domeBtn.addEventListener('click', play);
  skip.addEventListener('click', reveal);
  video.addEventListener('click', reveal);
}
