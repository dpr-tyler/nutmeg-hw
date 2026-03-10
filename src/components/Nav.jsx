import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import LanguageToggle from './LanguageToggle'

export default function Nav() {
  const { t, i18n } = useTranslation()
  const isJa = i18n.language === 'ja'
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => {
    if (!mobileMenuOpen) return
    const handler = (e) => { if (e.key === 'Escape') setMobileMenuOpen(false) }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [mobileMenuOpen])

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileMenuOpen])

  const closeMenu = () => setMobileMenuOpen(false)

  const links = [
    { key: 'nav.itinerary', href: '#itinerary' },
    { key: 'nav.beaches', href: '#beaches' },
    { key: 'nav.locations', href: '#locations' },
    { key: 'nav.food', href: '#food' },
    { key: 'nav.tips', href: '#tips' },
  ]

  return (
    <>
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
        <div className="max-w-7xl mx-auto px-6 pt-8 pb-4 flex items-center justify-between">
          <a
            href="#hero"
            className="font-display text-white text-4xl tracking-wide shrink-0"
            style={{ fontFamily: isJa ? '"Cormorant Garamond", "Georgia", serif' : 'var(--font-display)', letterSpacing: '0.05em' }}
          >
            Oahu
          </a>

          <div className="flex-1 flex items-center justify-center min-w-0">
            <div className="hidden md:flex items-center gap-12">
              {links.map((link) => (
                <a
                  key={link.key}
                  href={link.href}
                  className="text-base text-white/80 hover:text-white transition-colors duration-200"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  {t(link.key)}
                </a>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end shrink-0 gap-2">
            <div className="hidden md:block">
              <LanguageToggle />
            </div>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 text-white hover:text-white/80 transition-colors"
              aria-label={t('ui.aria.openMenu')}
            >
              <Menu size={24} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              key="mobile-overlay"
              role="dialog"
              aria-modal="true"
              aria-label={t('ui.aria.navigationMenu')}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMenu}
              className="fixed inset-0 z-60 cursor-default"
              style={{ background: 'rgba(0,0,0,0.5)' }}
            />
            <motion.aside
              key="mobile-panel"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.25, ease: 'easeOut' }}
              className="fixed top-0 right-0 bottom-0 z-70 w-72 flex flex-col"
              style={{
                background: 'rgba(27,79,107,0.98)',
                backdropFilter: 'blur(12px)',
                boxShadow: '-4px 0 24px rgba(0,0,0,0.2)',
              }}
            >
              <div className="flex justify-end p-6 pb-4">
                <button
                  type="button"
                  onClick={closeMenu}
                  className="p-2 text-white hover:text-white/80 transition-colors"
                  aria-label={t('ui.aria.closeMenu')}
                >
                  <X size={24} strokeWidth={1.5} />
                </button>
              </div>
              <nav className="flex-1 px-6 flex flex-col gap-6" style={{ fontFamily: 'var(--font-body)' }}>
                {links.map((link) => (
                  <a
                    key={link.key}
                    href={link.href}
                    onClick={closeMenu}
                    className="text-lg text-white/80 hover:text-white transition-colors duration-200"
                  >
                    {t(link.key)}
                  </a>
                ))}
              </nav>
              <div className="p-6 pt-4 border-t border-white/10">
                <LanguageToggle />
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
