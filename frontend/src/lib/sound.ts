let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }
  return audioCtx;
}

function playBeep(freq: number, startTime: number, duration: number, gainValue = 0.3): void {
  const ctx = getAudioContext();
  const osc = ctx.createOscillator();
  const gainNode = ctx.createGain();

  osc.connect(gainNode);
  gainNode.connect(ctx.destination);

  osc.type = "sine";
  osc.frequency.setValueAtTime(freq, startTime);

  gainNode.gain.setValueAtTime(gainValue, startTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

  osc.start(startTime);
  osc.stop(startTime + duration);
}

// 페이즈 전환: 상승 2음 (띵동)
export function playPhaseChange(): void {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    playBeep(523, now, 0.15);        // C5
    playBeep(659, now + 0.18, 0.2);  // E5
  } catch {
    // 사운드 실패 시 앱 중단 방지
  }
}

// 60초 경고: 단음 (띵)
export function playWarning(): void {
  try {
    const ctx = getAudioContext();
    playBeep(440, ctx.currentTime, 0.25); // A4
  } catch {
    // 사운드 실패 시 앱 중단 방지
  }
}

// 전체 완료: 상승 3음 (띵동댕)
export function playComplete(): void {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    playBeep(523, now, 0.15);         // C5
    playBeep(659, now + 0.18, 0.15);  // E5
    playBeep(784, now + 0.36, 0.3);   // G5
  } catch {
    // 사운드 실패 시 앱 중단 방지
  }
}
