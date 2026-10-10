import { motion } from 'framer-motion';
import { useState } from 'react';

import { useSceneTimer } from '@/lib/video';
import heroImage from '@assets/IMG-20260925-WA0006_1790363975752.jpg';

export function IntroScene() {
  const [beat, setBeat] = useState(0);

  useSceneTimer([
    { time: 900, callback: () => setBeat(1) },
    { time: 1650, callback: () => setBeat(2) },
    { time: 2700, callback: () => setBeat(3) },
  ]);

  return (
    <motion.section
      className="scene"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.03, filter: 'blur(8px)' }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      style={{ background: 'var(--color-bg-light)' }}
    >
      <motion.div
        className="hero-photo intro-photo"
        initial={{ x: '4%', scale: 1.04 }}
        animate={{ x: '0%', scale: 1 }}
        transition={{ duration: 3.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <img src={heroImage} alt="" />
      </motion.div>

      <div className="intro-copy">
        <motion.div
          className="eyebrow"
          initial={{ opacity: 0, letterSpacing: '.28em' }}
          animate={{ opacity: 1, letterSpacing: '.14em' }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          P3 HEALTH LAB / KIGALI
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
        >
          The air around us
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: beat >= 1 ? 1 : 0, y: beat >= 1 ? 0 : 16 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
        >
          Shapes how we live.
        </motion.p>
      </div>

      <motion.div
        className="intro-line"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: beat >= 1 ? 1 : 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      />

      <motion.div
        className="ring ring-one"
        initial={{ opacity: 0, scale: 0.4 }}
        animate={{ opacity: beat >= 1 ? 1 : 0, scale: beat >= 1 ? 1 : 0.4 }}
        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
      />
      <motion.div
        className="ring ring-two"
        initial={{ opacity: 0, scale: 0.2 }}
        animate={{ opacity: beat >= 2 ? 0.85 : 0, scale: beat >= 2 ? 1 : 0.2 }}
        transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
      />
      <motion.div
        className="ring ring-three"
        initial={{ opacity: 0, scale: 0.15 }}
        animate={{ opacity: beat >= 3 ? 0.8 : 0, scale: beat >= 3 ? 1.3 : 0.15 }}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
      />
    </motion.section>
  );
}