'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function PulseRipple({
  incomingPulse,
}: {
  incomingPulse: boolean;
}) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!incomingPulse) return;

    setShow(true);

    // Trigger a short haptic pulse on supported mobile devices.
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([10, 30, 10]);
    }

    const timer = window.setTimeout(() => setShow(false), 2000);
    return () => window.clearTimeout(timer);
  }, [incomingPulse]);

  return (
    <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center">
      <AnimatePresence>
        {show && (
          <>
            <motion.div
              initial={{ scale: 0, opacity: 0.5 }}
              animate={{ scale: 4, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
              className="absolute h-40 w-40 rounded-full border-2 border-emerald-400/30"
            />
            <motion.div
              initial={{ scale: 0, opacity: 0.2 }}
              animate={{ scale: 6, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2, ease: 'easeOut' }}
              className="absolute h-60 w-60 rounded-full bg-emerald-300/10 blur-3xl"
            />
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
