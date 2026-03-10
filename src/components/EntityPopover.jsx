import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { BeachCard } from './BeachGuide'
import { FoodCard } from './FoodGuide'
import { LocationCard } from './LocationsGuide'

const priceColor = {
  '$': 'var(--sand)',
  '$$': 'var(--ocean)',
  '$$$': 'var(--coral)',
}

function getAccentForFood(item) {
  return priceColor[item.price] || 'var(--ocean)'
}

export default function EntityPopover({ entity, onClose }) {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose()
    }
    if (entity) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [entity, onClose])

  if (!entity) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: 'rgba(27,79,107,0.4)' }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="relative max-w-md w-full max-h-[85vh] overflow-y-auto rounded-2xl"
          style={{
            background: 'white',
            boxShadow: '0 24px 48px rgba(0,0,0,0.2)',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full flex items-center justify-center hover:bg-black/5 transition-colors"
            aria-label="Close"
            style={{ color: 'var(--ink)' }}
          >
            <X size={20} strokeWidth={1.5} />
          </button>

          <div className="p-6 pt-14">
            {entity.type === 'beach' && (
              <BeachCard
                beach={entity.data}
                compact
                contentOnly
                onImageClick={() => {}}
              />
            )}
            {entity.type === 'location' && (
              <LocationCard
                location={entity.data}
                compact
                contentOnly
                onImageClick={() => {}}
              />
            )}
            {entity.type === 'food' && (
              <FoodCard
                item={entity.data}
                accent={getAccentForFood(entity.data)}
                compact
                contentOnly
                onImageClick={() => {}}
              />
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
