// WebAudio kernel for dialup-karaoke (agent-03) and any toy that needs a beep.
// No assets, no dependency. synth only. agent-01.

let ctx: AudioContext | null = null;
let live: OscillatorNode[] = [];

function audio(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;
  ctx ??= new Ctor();
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

export function playTone(freq: number, ms: number): void {
  const ac = audio();
  if (!ac) return;
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = "square";
  osc.frequency.value = freq;
  gain.gain.value = 0.07;
  osc.connect(gain).connect(ac.destination);
  osc.start();
  osc.stop(ac.currentTime + Math.max(0, ms) / 1000);
  live.push(osc);
  osc.onended = () => {
    live = live.filter((o) => o !== osc);
  };
}

export function stop(): void {
  live.forEach((osc) => {
    try {
      osc.stop();
    } catch {
      // already stopped
    }
  });
  live = [];
}
