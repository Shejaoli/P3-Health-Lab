import { motion } from 'framer-motion';
import { useState } from 'react';

import { useSceneTimer } from '@/lib/video';

export function SharedHealthScene() {
  const [beat, setBeat] = useState(0);

  useSceneTimer([
    { time: 550, callback: () => setBeat(1) },
    { time: 1450, callback: () => setBeat(2) },
    { time: 2500, callback: () => setBeat(3) },
    { time: 3950, callback: () => setBeat(4) },
  ]);

  return (
    <motion.section
      className="scene shared-scene"
      initial={{ opacity: 0, clipPath: 'circle(0% at 50% 50%)' }}
      animate={{ opacity: 1, clipPath: 'circle(120% at 50% 50%)' }}
      exit={{ opacity: 0, scale: 1.06 }}
      transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
    >
      <div className="shared-copy">
        <motion.div
          className="eyebrow"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          THE HUMAN OUTCOME
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: beat >= 1 ? 1 : 0, y: beat >= 1 ? 0 : 20 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          Health is shared.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: beat >= 2 ? 1 : 0 }}
          transition={{ duration: 0.5 }}
        >
          People · places · possibility
        </motion.p>
      </div>

      <div className="shared-network" aria-hidden="true">
        <motion.div className="shared-rule rule-a" initial={{ scaleX: 0 }} animate={{ scaleX: beat >= 1 ? 1 : 0 }} transition={{ duration: 0.55 }} />
        <motion.div className="shared-rule rule-b" initial={{ scaleX: 0 }} animate={{ scaleX: beat >= 1 ? 1 : 0 }} transition={{ duration: 0.55, delay: 0.15 }} />
        <motion.div className="shared-rule rule-c" initial={{ scaleX: 0 }} animate={{ scaleX: beat >= 2 ? 1 : 0 }} transition={{ duration: 0.55 }} />
        <motion.div className="shared-rule rule-d" initial={{ scaleX: 0 }} animate={{ scaleX: beat >= 2 ? 1 : 0 }} transition={{ duration: 0.55, delay: 0.15 }} />
        {[0, 1, 2, 3].map((node) => (
          <motion.div
            key={node}
            className="shared-node"
            initial={{ opacity: 0, scale: 0.2, rotate: -12 }}
            animate={{ opacity: beat >= 1 ? 1 : 0, scale: beat >= 1 ? 1 : 0.2, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 22, delay: node * 0.13 }}
          />
        ))}
        <motion.div
          className="shared-core"
          initial={{ opacity: 0, scale: 0.3 }}
          animate={{ opacity: beat >= 2 ? 1 : 0, scale: beat >= 4 ? 2.4 : beat >= 2 ? 1 : 0.3 }}
          transition={{ duration: beat >= 4 ? 1.1 : 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          A COMMON<br />CENTRE
        </motion.div>
      </div>

      <motion.div
        className="shared-wordmark mono"
        initial={{ opacity: 0, x: -16 }}
        animate={{ opacity: beat >= 3 ? 1 : 0, x: beat >= 3 ? 0 : -16 }}
        transition={{ duration: 0.45 }}
      >
        From evidence to action.
      </motion.div>
    </motion.section>
  );
}