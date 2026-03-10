import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.2, delayChildren: 0.3 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] } },
}

export default function Hero() {
  const { t, i18n } = useTranslation()
  const isJa = i18n.language === 'ja'

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        background: `
          radial-gradient(ellipse at 20% 50%, rgba(27,79,107,0.9) 0%, transparent 60%),
          radial-gradient(ellipse at 80% 20%, rgba(198,169,107,0.3) 0%, transparent 50%),
          radial-gradient(ellipse at 60% 80%, rgba(217,107,79,0.2) 0%, transparent 40%),
          linear-gradient(135deg, #0d3347 0%, #1B4F6B 40%, #2d7a9e 70%, #1a5c78 100%)
        `,
      }}
    >
      {/* Noise texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: '256px 256px',
        }}
      />

      {/* Soft wave at bottom */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" preserveAspectRatio="none" style={{ display: 'block', width: '100%', height: '80px' }}>
          <path
            d="M0,60 C240,100 480,20 720,60 C960,100 1200,20 1440,60 L1440,120 L0,120 Z"
            fill="#F5EFE0"
          />
        </svg>
      </div>

      {/* Content */}
      <motion.div
        className="relative z-10 text-center px-6 max-w-4xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <span
            className="inline-block text-xs tracking-widest uppercase mb-6 px-4 py-1.5 rounded-full"
            style={{
              fontFamily: 'var(--font-mono)',
              color: 'rgba(198,169,107,0.9)',
              border: '1px solid rgba(198,169,107,0.3)',
              background: 'rgba(198,169,107,0.08)',
              letterSpacing: '0.2em',
            }}
          >
            Hawaii · Oahu
          </span>
        </motion.div>

        <motion.h1
          variants={itemVariants}
          className="font-display text-white mb-6 leading-none"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(3rem, 8vw, 7rem)',
            fontWeight: 300,
            letterSpacing: '-0.02em',
            lineHeight: 1.05,
          }}
        >
          {t('hero.title')}
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="text-white/70 mb-12 max-w-xl mx-auto"
          style={{
            fontSize: 'clamp(1rem, 2vw, 1.2rem)',
            lineHeight: 1.7,
            fontFamily: isJa ? "'Hiragino Kaku Gothic ProN', 'Noto Sans JP', sans-serif" : 'var(--font-body)',
          }}
        >
          {t('hero.subtitle')}
        </motion.p>

        <motion.a
          variants={itemVariants}
          href="#overview"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-white font-medium transition-all duration-300 hover:gap-3"
          style={{
            background: 'var(--coral)',
            fontFamily: 'var(--font-body)',
            fontSize: '0.95rem',
            boxShadow: '0 4px 24px rgba(217,107,79,0.35)',
          }}
        >
          {t('hero.cta')}
          <ChevronDown size={18} />
        </motion.a>
      </motion.div>

      {/* Animated scroll indicator */}
      <motion.div
        className="absolute bottom-24 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
      >
        <ChevronDown size={24} color="rgba(255,255,255,0.4)" />
      </motion.div>
    </section>
  )
}
