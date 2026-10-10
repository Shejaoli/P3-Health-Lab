import { motion } from 'framer-motion';
import { useState } from 'react';

import { useSceneTimer } from '@/lib/video';

const TRACE = 'M 2 48 C 12 48, 14 38, 23 38 S 37 60, 46 52 S 60 22, 72 35 S 84 50, 98 18';

export function EvidenceScene() {
  const [beat, setBeat] = useState(0);

  useSceneTimer([
    { time: 500, callback: () => setBeat(1) },
    { time: 1400, callback: () => setBeat(2) },
    { time: 2550, callback: () => setBeat(3) },
    { time: 3900, callback: () => setBeat(4) },
    { time: 4850, callback: () => setBeat(5) },
  ]);

  return (
    <motion.section
      className="scene evidence-scene"
      initial={{ opacity: 0, clipPath: 'inset(0 0 100% 0)' }}
      animate={{ opacity: 1, clipPath: 'inset(0 0 0% 0)' }}
      exit={{ opacity: 0, clipPath: 'inset(0 0 0 100%)' }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
    >
      <div className="evidence-grid" />

      <motion.div
        className="evidence-copy"
        initial={{ opacity: 0, x: -32 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.65, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="eyebrow" style={{ color: 'var(--color-success)' }}>
          P3 / MAKING SENSE TOGETHER
        </div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: beat >= 1 ? 1 : 0, y: beat >= 1 ? 0 : 20 }}
          transition={{ duration: 0.55 }}
        >
          {beat >= 3 ? 'See the pattern.' : beat >= 1 ? 'Evidence moves' : ''}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: beat >= 2 ? 1 : 0 }}
          transition={{ duration: 0.5 }}
        >
          Research becomes useful when it can travel between people, places, and decisions.
        </motion.p>
      </motion.div>

      <svg className="evidence-trace" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <motion.path
          d={TRACE}
          fill="none"
          stroke="rgba(242,239,232,.9)"
          strokeWidth=".35"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: beat >= 1 ? 1 : 0, opacity: beat >= 1 ? 1 : 0 }}
          transition={{ pathLength: { duration: 2.4, ease: 'easeInOut' }, opacity: { duration: 0.25 } }}
        />
        <motion.path
          d="M 46 52 C 54 72, 62 72, 75 67"
          fill="none"
          stroke="var(--color-success)"
          strokeWidth=".28"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: beat >= 2 ? 1 : 0, opacity: beat >= 2 ? 1 : 0 }}
          transition={{ duration: 1.1, ease: 'easeOut' }}
        />
        <motion.path
          d="M 72 35 C 76 25, 82 27, 91 21"
          fill="none"
          stroke="var(--color-success)"
          strokeWidth=".28"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: beat >= 2 ? 1 : 0, opacity: beat >= 2 ? 1 : 0 }}
          transition={{ duration: 1.1, delay: 0.25, ease: 'easeOut' }}
        />
        {[{ x: 46, y: 52 }, { x: 72, y: 35 }, { x: 75, y: 67 }, { x: 91, y: 21 }].map((node) => (
          <motion.circle
            key={`${node.x}-${node.y}`}
            cx={node.x}
            cy={node.y}
            r="1.35"
            fill="var(--color-success)"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: beat >= 2 ? 1 : 0, scale: beat >= 2 ? 1 : 0 }}
            transition={{ duration: 0.35, delay: 0.2 }}
          />
        ))}
      </svg>

      <motion.div className="evidence-label label-research" initial={{ opacity: 0, y: 10 }} animate={{ opacity: beat >= 2 ? 1 : 0, y: beat >= 2 ? 0 : 10 }}>
        Research
      </motion.div>
      <motion.div className="evidence-label label-teaching" initial={{ opacity: 0, y: 10 }} animate={{ opacity: beat >= 2 ? 1 : 0, y: beat >= 2 ? 0 : 10 }} transition={{ delay: 0.16 }}>
        Teaching
      </motion.div>
      <motion.div className="evidence-label label-action" initial={{ opacity: 0, x: 12 }} animate={{ opacity: beat >= 2 ? 1 : 0, x: beat >= 2 ? 0 : 12 }} transition={{ delay: 0.32 }}>
        Action
      </motion.div>

      <motion.div
        className="coral-dot"
        initial={{ left: '48%', top: '51%', opacity: 0 }}
        animate={{
          left: beat >= 4 ? '88%' : '48%',
          top: beat >= 4 ? '31%' : '51%',
          opacity: beat >= 3 ? 1 : 0,
        }}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
      />
      <motion.div
        className="absolute left-1/2 top-1/2 z-[1] h-[32vmin] w-[32vmin] -translate-x-1/2 -translate-y-1/2 rounded-full border-[.2vmin] border-[#7b9c77]"
        initial={{ opacity: 0, scale: 0.25 }}
        animate={{ opacity: beat >= 5 ? 0.85 : 0, scale: beat >= 5 ? 1.35 : 0.25 }}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
      />
    </motion.section>
  );
}