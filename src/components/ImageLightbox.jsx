import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'

export default function ImageLightbox({ src, alt, isOpen, onClose }) {
  const { t } = useTranslation()

  useEffect(() => {
    if (!isOpen) return
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isOpen, onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={t('ui.aria.imageViewer')}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)',
                   display: 'flex', alignItems: 'center', justifyContent: 'center',
                   zIndex: 9999, cursor: 'zoom-out' }}
        >
          <button aria-label={t('ui.aria.close')} onClick={onClose} style={{ position: 'absolute', top: 20, right: 24,
            background: 'none', border: 'none', color: 'white', fontSize: '1.5rem',
            cursor: 'pointer', lineHeight: 1 }}>✕</button>

          <motion.img
            src={`${src.split('?')[0]}?w=1200&auto=format`}
            alt={alt}
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.85, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '90vw', maxHeight: '90vh', borderRadius: '12px',
                     objectFit: 'contain', cursor: 'default' }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
