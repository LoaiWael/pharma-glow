import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { gsap } from 'gsap';
import { motion, useAnimationFrame, useMotionValue } from 'motion/react';

export type TextLoopShape = 'wave' | 'circle' | 'infinity' | 'arch' | 'line';
export type TextLoopDirection = 'forward' | 'reverse';
export type TextLoopDir = 'ltr' | 'rtl';

export interface TextLoopProps {
  text?: string;
  shape?: TextLoopShape;
  path?: string;
  speed?: number;
  direction?: TextLoopDirection;
  separator?: string;
  curviness?: number;
  fontSize?: number;
  fontWeight?: number | string;
  letterSpacing?: number;
  uppercase?: boolean;
  color?: string;
  ribbon?: boolean;
  ribbonColor?: string;
  ribbonWidth?: number;
  pauseOnHover?: boolean;
  dir?: TextLoopDir;
  className?: string;
  style?: CSSProperties;
}

interface Metrics {
  length: number;
  reps: number;
}

const VIEW_W = 1200;
const VIEW_H = 520;
const CX = VIEW_W / 2;
const CY = VIEW_H / 2;
const EDGE_PAD = 6;

const getViewHeight = (shape: TextLoopShape, ribbonWidth: number, customPath?: string) => {
  if (customPath || shape !== 'line') {
    return VIEW_H;
  }

  return Math.max(32, Math.round(ribbonWidth + 8));
};

const buildPath = (
  shape: TextLoopShape,
  curviness: number,
  ribbonWidth: number,
  viewH: number,
  viewW: number
): string => {
  const c = Math.max(0, curviness);
  const cy = shape === 'line' ? viewH / 2 : CY;
  const room = Math.max(20, CY - Math.max(0, ribbonWidth) / 2 - EDGE_PAD);

  switch (shape) {
    case 'circle': {
      const r = Math.min(90 + c * 0.95, room);
      return `M ${CX - r} ${CY} A ${r} ${r} 0 1 1 ${CX + r} ${CY} A ${r} ${r} 0 1 1 ${CX - r} ${CY} Z`;
    }
    case 'infinity': {
      const r = 150 + c * 1.4;
      const h = Math.min(60 + c * 0.95, room);
      return [
        `M ${CX} ${CY}`,
        `C ${CX + r * 0.55} ${CY - h} ${CX + r} ${CY - h} ${CX + r} ${CY}`,
        `C ${CX + r} ${CY + h} ${CX + r * 0.55} ${CY + h} ${CX} ${CY}`,
        `C ${CX - r * 0.55} ${CY - h} ${CX - r} ${CY - h} ${CX - r} ${CY}`,
        `C ${CX - r} ${CY + h} ${CX - r * 0.55} ${CY + h} ${CX} ${CY}`,
        'Z'
      ].join(' ');
    }
    case 'arch': {
      const rise = Math.min(120 + c * 1.1, room * 2);
      return `M 120 ${CY + rise / 2} Q ${CX} ${CY - rise * 1.5} ${VIEW_W - 120} ${CY + rise / 2}`;
    }
    case 'line':
      return `M ${-Math.max(48, viewW * 0.25)} ${cy} L ${viewW + Math.max(48, viewW * 0.25)} ${cy}`;
    case 'wave':
    default: {
      const a = Math.min(c * 2.2, room * 2);
      return `M -320 ${CY} Q -160 ${CY - a} 0 ${CY} T 320 ${CY} T 640 ${CY} T 960 ${CY} T 1280 ${CY} T ${VIEW_W + 320} ${CY}`;
    }
  }
};

interface LineMarqueeProps {
  unit: string;
  dir: TextLoopDir;
  speed: number;
  direction: TextLoopDirection;
  fontSize: number;
  fontWeight: number | string;
  letterSpacing: number;
  color: string;
  pauseOnHover: boolean;
  viewH: number;
  className: string;
  style: CSSProperties;
}

const LineMarquee = ({
  unit,
  dir,
  speed,
  direction,
  fontSize,
  fontWeight,
  letterSpacing,
  color,
  pauseOnHover,
  viewH,
  className,
  style
}: LineMarqueeProps) => {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const measureRef = useRef<HTMLSpanElement | null>(null);
  const [copies, setCopies] = useState(4);
  const [unitWidth, setUnitWidth] = useState(0);
  const [paused, setPaused] = useState(false);
  const x = useMotionValue(0);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const measureEl = measureRef.current;
    if (!root || !measureEl) {
      return undefined;
    }

    const measure = () => {
      const uWidth = measureEl.getBoundingClientRect().width;
      const rWidth = root.getBoundingClientRect().width;
      if (!uWidth || !rWidth) {
        return;
      }

      const nextCopies = Math.max(2, Math.ceil(rWidth / uWidth) + 2);
      setUnitWidth(uWidth);
      setCopies(prev => {
        if (prev !== nextCopies) {
          x.set(0);
        }
        return prev === nextCopies ? prev : nextCopies;
      });
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(root);
    if (typeof document !== 'undefined' && document.fonts?.ready) {
      document.fonts.ready.then(measure).catch(() => {});
    }

    return () => observer.disconnect();
  }, [unit, fontSize, fontWeight, letterSpacing, dir]);

  useAnimationFrame((_time, delta) => {
    if (paused || speed <= 0 || !unitWidth) {
      return;
    }

    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const deltaPx = (speed * delta) / 1000;
    const isReverse = direction === 'reverse';

    let next = x.get() + (isReverse ? deltaPx : -deltaPx);

    if (!isReverse && next <= -unitWidth) {
      next += unitWidth;
    } else if (isReverse && next >= 0) {
      next -= unitWidth;
    }

    x.set(next);
  });

  const sequence = Array.from({ length: copies }, (_, index) => (
    <span className="shrink-0 px-3" dir={dir} key={`${dir}-${index}`}>
      {unit}
    </span>
  ));

  return (
    <div
      ref={rootRef}
      className={`relative w-full overflow-hidden ${className}`.trim()}
      dir="ltr"
      style={{ ...style, height: viewH, color }}
      onPointerEnter={pauseOnHover ? () => setPaused(true) : undefined}
      onPointerLeave={pauseOnHover ? () => setPaused(false) : undefined}
    >
      <span
        ref={measureRef}
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 opacity-0 whitespace-nowrap px-3"
        dir={dir}
        style={{
          fontSize,
          fontWeight,
          letterSpacing: `${letterSpacing}px`
        }}
      >
        {unit}
      </span>

      <motion.div
        className="flex h-full w-max items-center whitespace-nowrap"
        dir="ltr"
        style={{
          x,
          fontSize,
          fontWeight,
          letterSpacing: `${letterSpacing}px`
        }}
      >
        {sequence}
      </motion.div>
    </div>
  );
};

const TextLoop = ({
  text = 'React ✦ Bits',
  shape = 'wave',
  path,
  speed = 90,
  direction = 'forward',
  separator = '✦',
  curviness = 90,
  fontSize = 46,
  fontWeight = 800,
  letterSpacing = 2,
  uppercase = true,
  color = '#ffffff',
  ribbon = true,
  ribbonColor = '#5227FF',
  ribbonWidth = 86,
  pauseOnHover = true,
  dir = 'ltr',
  className = '',
  style = {}
}: TextLoopProps) => {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const pathRef = useRef<SVGPathElement | null>(null);
  const measureRef = useRef<SVGTextElement | null>(null);
  const textPathRef = useRef<SVGTextPathElement | null>(null);

  const [metrics, setMetrics] = useState<Metrics>({ length: 0, reps: 1 });
  const [unitWidth, setUnitWidth] = useState(0);
  const [lineViewW, setLineViewW] = useState(VIEW_W);

  const rawId = useId();
  const pathId = `text-loop-${rawId.replace(/:/g, '')}`;
  const isLine = !path && shape === 'line';
  const viewW = isLine ? lineViewW : VIEW_W;

  const viewH = getViewHeight(shape, ribbonWidth, path);
  const d = useMemo(
    () => path || buildPath(shape, curviness, ribbonWidth, viewH, viewW),
    [path, shape, curviness, ribbonWidth, viewH, viewW]
  );

  useLayoutEffect(() => {
    if (!isLine) {
      return undefined;
    }

    const el = rootRef.current;
    if (!el) {
      return undefined;
    }

    const updateWidth = () => {
      const next = Math.max(1, Math.round(el.clientWidth));
      setLineViewW(prev => (prev === next ? prev : next));
    };

    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    observer.observe(el);

    return () => observer.disconnect();
  }, [isLine]);

  const unit = useMemo(() => {
    const base = uppercase ? String(text).toUpperCase() : String(text);
    const gap = separator ? `\u00A0${separator}\u00A0` : '\u00A0\u00A0\u00A0';
    return `${base}${gap}`;
  }, [text, separator, uppercase]);

  const textStyle = useMemo<CSSProperties>(
    () => ({ fontSize: `${fontSize}px`, fontWeight, letterSpacing: `${letterSpacing}px` }),
    [fontSize, fontWeight, letterSpacing]
  );

  useLayoutEffect(() => {
    const pathEl = pathRef.current;
    const measureEl = measureRef.current;
    if (!pathEl || !measureEl) return undefined;

    let cancelled = false;

    const measure = () => {
      if (cancelled) return;
      let length = 0;
      let uWidth = 0;
      try {
        length = pathEl.getTotalLength();
        uWidth = measureEl.getComputedTextLength();
      } catch {
        return;
      }
      if (!length) return;

      const reps = uWidth > 0 ? Math.max(2, Math.ceil(length / uWidth) + 2) : 2;
      setUnitWidth(uWidth);
      setMetrics(prev => (prev.length === length && prev.reps === reps ? prev : { length, reps }));
    };

    measure();
    if (typeof document !== 'undefined' && document.fonts?.ready) {
      document.fonts.ready.then(measure).catch(() => {});
    }

    return () => {
      cancelled = true;
    };
  }, [d, unit, fontSize, fontWeight, letterSpacing]);

  useEffect(() => {
    const textPathEl = textPathRef.current;
    if (!textPathEl || !unitWidth || speed <= 0) return undefined;

    const prefersReduced =
      typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return undefined;

    const targetOffset = direction === 'reverse' ? unitWidth : -unitWidth;
    const state = { offset: 0 };
    const tween = gsap.to(state, {
      offset: targetOffset,
      duration: unitWidth / speed,
      ease: 'none',
      repeat: -1,
      onUpdate: () => {
        textPathEl.setAttribute('startOffset', `${state.offset}px`);
      }
    });

    const root = rootRef.current;
    const pause = () => tween.pause();
    const resume = () => tween.resume();

    if (pauseOnHover && root) {
      root.addEventListener('pointerenter', pause);
      root.addEventListener('pointerleave', resume);
    }

    return () => {
      tween.kill();
      if (pauseOnHover && root) {
        root.removeEventListener('pointerenter', pause);
        root.removeEventListener('pointerleave', resume);
      }
    };
  }, [unitWidth, speed, direction, pauseOnHover]);

  const loopText = unit.repeat(metrics.reps);

  if (isLine) {
    return (
      <LineMarquee
        className={className}
        color={color}
        dir={dir}
        direction={direction}
        fontSize={fontSize}
        fontWeight={fontWeight}
        letterSpacing={letterSpacing}
        pauseOnHover={pauseOnHover}
        speed={speed}
        style={style}
        unit={unit}
        viewH={viewH}
      />
    );
  }

  return (
    <div ref={rootRef} className={`relative w-full overflow-hidden ${className}`.trim()} dir="ltr" style={style}>
      <svg
        className="block w-full h-auto"
        viewBox={`0 0 ${viewW} ${viewH}`}
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label={text}
        direction="ltr"
      >
        <path
          ref={pathRef}
          id={pathId}
          d={d}
          fill="none"
          stroke={ribbon ? ribbonColor : 'none'}
          strokeWidth={ribbon ? ribbonWidth : 0}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <text ref={measureRef} className="opacity-0 pointer-events-none" style={textStyle} aria-hidden="true" direction={dir}>
          {unit}
        </text>

        <text className="select-none" style={textStyle} fill={color} dominantBaseline="central" aria-hidden="true" direction={dir}>
          <textPath ref={textPathRef} href={`#${pathId}`} startOffset={0}>
            {loopText}
          </textPath>
        </text>
      </svg>
    </div>
  );
};

export default TextLoop;
