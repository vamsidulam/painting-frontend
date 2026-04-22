import { useEffect, useState } from "react";

type Props = {
  to: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
};

export function Counter({ to, prefix = "", suffix = "", duration = 1200 }: Props) {
  const [n, setN] = useState(0);

  useEffect(() => {
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(to * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to, duration]);

  return (
    <>
      {prefix}
      {n.toLocaleString()}
      {suffix}
    </>
  );
}
