import { motion } from 'framer-motion';
import { useState } from 'react';

import { useSceneTimer } from '@/lib/video';
import logo from '@assets/p3_logo_1789065448410.png';

export function OutroScene() {
  const [beat, setBeat] = useState(0);

  useSceneTimer([
    { time: 700, callback: () => setBeat(1) },
    { time: 1450, callback: () => setBeat(2) },
    { time: 2000, callback: () => setBeat(3) },
    { time: 2800, callback: () => setBeat(4) },
  ]);

  return (
    <motion.section
      className="scene outro-scene"
      initial={{ opacity: 0, scale: 1.04 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.div
        className="outro-aperture"
        initial={{ opacity: 0.2, scale: 1.7 }}
        animate={{ opacity: beat >= 4 ? 0.25 : 0.9, scale: beat >= 4 ? 0.12 : 1 }}
        transition={{ duration: beat >= 4 ? 1.2 : 0.9, ease: [0.16, 1, 0.3, 1] }}
      />

      <div className="outro-lockup">
        <motion.img
          src={logo}
          alt="P3 Health Lab"
          initial={{ opacity: 0, y: 16, scale: 0.92 }}
          animate={{ opacity: beat >= 1 ? 1 : 0, y: beat >= 1 ? 0 : 16, scale: beat >= 1 ? 1 : 0.92 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        />
        <div className="outro-mission" aria-label="Clean air. Healthy people. Thriving planet.">
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: beat >= 2 ? 1 : 0, y: beat >= 2 ? 0 : 14 }} transition={{ duration: 0.4 }}>
            Clean air.
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: beat >= 2 ? 1 : 0, y: beat >= 2 ? 0 : 14 }} transition={{ duration: 0.4, delay: 0.12 }}>
            Healthy people.
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: beat >= 2 ? 1 : 0, y: beat >= 2 ? 0 : 14 }} transition={{ duration: 0.4, delay: 0.24 }}>
            Thriving planet.
          </motion.div>
        </div>
        <motion.div
          className="outro-descriptor mono"
          initial={{ opacity: 0, letterSpacing: '.2em' }}
          animate={{ opacity: beat >= 3 ? 1 : 0, letterSpacing: '.11em' }}
          transition={{ duration: 0.55 }}
        >
          Air pollution &amp; environmental health
        </motion.div>
      </div>

      <motion.div
        className="outro-horizon"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: beat >= 3 ? (beat >= 4 ? 0.22 : 1) : 0 }}
        transition={{ duration: beat >= 4 ? 1.15 : 0.75, ease: [0.16, 1, 0.3, 1] }}
      />
    </motion.section>
  );
}