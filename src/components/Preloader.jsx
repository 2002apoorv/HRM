import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const Preloader = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <style>
        {`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@600&display=swap');

        .preloader-wrapper {
          position: fixed;
          inset: 0;
          z-index: 9999;
          background: linear-gradient(to bottom right, #000, #1a005c, #0b001f);
          display: flex;
          justify-content: center;
          align-items: center;
          transition: opacity 0.8s ease;
        }

        .preloader-wrapper.disabled {
          pointer-events: none;
        }

        .preloader-content {
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 24px;
        }

        .preloader-title {
          font-family: 'Orbitron', sans-serif;
          font-size: 3rem;
          font-weight: 800;
          color: white;
          text-shadow: 0 0 10px #00fff7, 0 0 20px #00fff7;
          letter-spacing: 6px;
        }

        .preloader-title span {
          color: #00fff7;
          font-style: italic;
        }

        .preloader-bar-container {
          width: 250px;
          height: 6px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          overflow: hidden;
          position: relative;
        }

        .preloader-bar-shimmer {
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          width: 25%;
          background: linear-gradient(to right, #9f00ff, #ff4de2);
          border-radius: 10px;
        }

        .preloader-tagline {
          color: rgba(255, 255, 255, 0.7);
          font-style: italic;
          font-size: 14px;
          letter-spacing: 1px;
        }
        `}
      </style>

      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: loading ? 1 : 0 }}
        transition={{ duration: 0.8 }}
        onAnimationComplete={() => {
          if (!loading) document.body.style.overflow = 'visible';
        }}
        className={`preloader-wrapper ${loading ? '' : 'disabled'}`}
      >
        <div className="preloader-content">
          <motion.h1
            initial={{ scale: 0.8, rotateX: 90, opacity: 0 }}
            animate={{ scale: 1, rotateX: 0, opacity: 1 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            className="preloader-title"
          >
            <span>V</span>ORNIQ
          </motion.h1>

          <motion.div
            className="preloader-bar-container"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <motion.div
              className="preloader-bar-shimmer"
              initial={{ x: '-100%' }}
              animate={{ x: '200%' }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="preloader-tagline"
          >
            Business Solutions Reimagined
          </motion.p>
        </div>
      </motion.div>
    </>
  );
};

export default Preloader;
