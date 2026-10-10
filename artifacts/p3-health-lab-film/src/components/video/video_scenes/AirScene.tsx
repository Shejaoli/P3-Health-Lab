import { motion } from 'framer-motion';
import { useState } from 'react';

import { useSceneTimer } from '@/lib/video';
import heroImage from '@assets/IMG-20260925-WA0006_1790363975752.jpg';

export function AirScene() {
  const [beat, setBeat] = useState(0);

  useSceneTimer([
    { time: 650, callback: () => setBeat(1) },
    { time: 1500, callback: () => setBeat(2) },
    { time: 2350, callback: () => setBeat(3) },
    { time: 3900, callback: () => setBeat(4) },
  ]);

  return (
    <motion.section
      className="scene"
      initial={{ opacity: 0, y: '3%' }}
      animate={{ opacity: 1, y: '0%' }}
      exit={{ opacity: 0, y: '-3%', scale: 1.04 }}
      transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.div
        className="hero-photo air-photo"
        initial={{ scale: 1.12, x: '2%' }}
        animate={{ scale: beat >= 4 ? 1.2 : 1.04, x: beat >= 4 ? '-2%' : '0%' }}
        transition={{ duration: beat >= 4 ? 1.15 : 3.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <img src={heroImage} alt="" style={{ objectPosition: 'center' }} />
      </motion.div>

      <motion.div
        className="air-word"
        initial={{ opacity: 0, scale: 0.82, filter: 'blur(12px)' }}
        animate={{ opacity: 1, scale: beat >= 4 ? 1.08 : 1, filter: 'blur(0px)' }}
        transition={{ duration: beat >= 4 ? 1 : 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <span>AIR</span>
        <span style={{ marginLeft: '11vmin' }}>PLACE</span>
      </motion.div>

      <div className="air-copy">
        <motion.div
          className="eyebrow"
          style={{ color: 'var(--color-text-inverse)' }}
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55 }}
        >
          THE EVERYDAY ENVIRONMENT
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: beat >= 1 ? 1 : 0, y: beat >= 1 ? 0 : 20 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          Air
        </motion.h1>
      </div>

      <motion.div
        className="air-callout"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: beat >= 2 ? 1 : 0, y: beat >= 2 ? 0 : 18 }}
        transition={{ duration: 0.55 }}
      >
        Where health begins.
      </motion.div>

      <motion.div
        className="air-label mono"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: beat >= 3 ? 1 : 0, x: beat >= 3 ? 0 : 20 }}
        transition={{ duration: 0.45 }}
      >
        Built environment
        <br />
        Everyday exposure
      </motion.div>

      <motion.svg
        className="absolute inset-0 z-[3] h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        initial={{ opacity: 0 }}
        animate={{ opacity: beat >= 2 ? 1 : 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.path
          d="M 89 77 C 72 70, 68 54, 58 54 C 48 54, 45 43, 30 30"
          fill="none"
          stroke="rgba(242,239,232,.84)"
          strokeWidth=".22"
          strokeDasharray="2 1"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: beat >= 3 ? 1 : 0 }}
          transition={{ duration: 1.15, ease: 'easeOut' }}
        />
      </motion.svg>
    </motion.section>
  );
}