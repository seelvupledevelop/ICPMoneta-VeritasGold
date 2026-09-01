import confetti from 'canvas-confetti';

export const triggerSettlementConfetti = () => {
  const count = 120;
  const defaults = {
    origin: { y: 0.7 },
    zIndex: 9999,
  };

  function fire(particleRatio: number, opts: confetti.Options) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio),
    });
  }

  // Gold bullion and sovereign crimson confetti stream
  fire(0.25, {
    spread: 26,
    startVelocity: 55,
    colors: ['#ef4444', '#f59e0b', '#10b981'],
  });

  fire(0.2, {
    spread: 60,
    colors: ['#f59e0b', '#d97706', '#fbbf24'],
  });

  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8,
    colors: ['#ef4444', '#10b981', '#ffffff'],
  });

  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    colors: ['#ef4444', '#f59e0b'],
  });

  fire(0.1, {
    spread: 120,
    startVelocity: 45,
    colors: ['#10b981', '#34d399'],
  });
};
