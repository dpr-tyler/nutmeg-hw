import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import LanguageToggle from './LanguageToggle'

export default function Nav() {
  const { t } = useTranslation()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const links = [
    { key: 'nav.overview', href: '#overview' },
    { key: 'nav.itinerary', href: '#itinerary' },
    { key: 'nav.beaches', href: '#beaches' },
    { key: 'nav.food', href: '#food' },
    { key: 'nav.tips', href: '#tips' },
  ]

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? 'rgba(27,79,107,0.95)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.1)' : 'none',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <a
          href="#hero"
          className="font-display text-white text-xl tracking-wide"
          style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.05em' }}
        >
          Oahu
        </a>

        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <a
              key={link.key}
              href={link.href}
              className="text-sm text-white/80 hover:text-white transition-colors duration-200"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              {t(link.key)}
            </a>
          ))}
        </div>

        <LanguageToggle />
      </div>
    </motion.nav>
  )
}
