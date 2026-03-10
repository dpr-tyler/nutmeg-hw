import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { UtensilsCrossed, Star, MapPin } from 'lucide-react'
import ImageLightbox from './ImageLightbox'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09 } },
}

const priceColor = {
  '$': 'var(--sand)',
  '$$': 'var(--ocean)',
  '$$$': 'var(--coral)',
}

export function FoodCard({ item, accent, onImageClick, compact = false }) {
  const { t } = useTranslation()
  const padding = compact ? 'p-4' : 'p-6'
  const gap = compact ? 'gap-3' : 'gap-4'

  return (
    <motion.div
      variants={compact ? {} : fadeUp}
      className={`rounded-2xl ${padding} flex flex-col ${gap}`}
      style={{
        background: 'white',
        border: '1px solid rgba(27,79,107,0.08)',
        boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
      }}
    >
      <div className="flex items-start gap-3">
        {item.photo && (
          <img
            src={item.photo}
            alt={item.name}
            {...(!compact && {
              onClick: () => onImageClick?.(item.photo, item.name),
              onKeyDown: (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onImageClick?.(item.photo, item.name) } },
              role: 'button',
              tabIndex: 0,
              'aria-label': `View full size photo of ${item.name}`,
              style: { width: 72, height: 72, cursor: 'zoom-in' },
            })}
            className="rounded-xl object-cover flex-shrink-0"
            style={{ width: compact ? 56 : 72, height: compact ? 56 : 72 }}
          />
        )}
        <div className="flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <h4
                className="font-display text-lg leading-snug"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--ink)', fontWeight: 600 }}
              >
                {item.name}
              </h4>
              <div className="flex items-center gap-2 mt-1">
                <span style={{ fontSize: '0.78rem', color: 'var(--ink)', opacity: 0.5, fontFamily: 'var(--font-mono)' }}>
                  {item.type}
                </span>
                <span
                  className="text-xs px-2 py-0.5 rounded-full budget-pill"
                  style={{
                    background: `${priceColor[item.price]}18`,
                    color: priceColor[item.price],
                  }}
                >
                  {item.price}
                </span>
              </div>
            </div>
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: `${accent}12` }}
            >
              <UtensilsCrossed size={15} color={accent} strokeWidth={1.5} />
            </div>
          </div>
        </div>
      </div>

      <div
        className="rounded-xl p-4"
        style={{ background: 'var(--mist)' }}
      >
        <div className="flex items-start gap-2">
          <Star size={13} color="var(--sand)" style={{ flexShrink: 0, marginTop: 2 }} />
          <div>
            <span
              className="text-xs uppercase tracking-widest block mb-1"
              style={{ fontFamily: 'var(--font-mono)', color: 'var(--sand)', letterSpacing: '0.12em', opacity: 0.8 }}
            >
              {t('food.whyGo')}
            </span>
            <p style={{ fontSize: '0.85rem', color: 'var(--ink)', opacity: 0.75, lineHeight: 1.65 }}>
              {item.whyGo}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function FoodCategory({ labelKey, items, accent, icon: Icon, onImageClick }) {
  const { t } = useTranslation()
  return (
    <div className="mb-16">
      <div className="flex items-center gap-3 mb-6">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: `${accent}15` }}
        >
          <Icon size={16} color={accent} strokeWidth={1.5} />
        </div>
        <h3
          className="font-display text-2xl"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--ink)', fontWeight: 600 }}
        >
          {t(labelKey)}
        </h3>
        <div className="flex-1 h-px" style={{ background: `${accent}20` }} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {items.map((item) => (
          <FoodCard key={item.name} item={item} accent={accent} onImageClick={onImageClick} />
        ))}
      </div>
    </div>
  )
}

export default function FoodGuide() {
  const { t } = useTranslation()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const [lightbox, setLightbox] = useState({ url: null, alt: '' })

  const foodItems = t('food.items', { returnObjects: true })

  return (
    <section
      id="food"
      ref={ref}
      className="py-24 px-6"
      style={{ background: 'var(--ivory)' }}
    >
      {/* Wave top */}
      <div className="wave-divider -mt-24" style={{ marginBottom: '-2px' }}>
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none" style={{ height: '80px', width: '100%' }}>
          <path d="M0,40 C360,0 1080,80 1440,20 L1440,0 L0,0 Z" fill="var(--mist)" />
        </svg>
      </div>

      <div className="max-w-6xl mx-auto">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          <motion.div variants={fadeUp} className="mb-16 text-center">
            <span
              className="inline-block text-xs tracking-widest uppercase mb-4"
              style={{ fontFamily: 'var(--font-mono)', color: 'var(--coral)', letterSpacing: '0.2em' }}
            >
              Eat & Drink
            </span>
            <h2
              className="font-display mb-4"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                fontWeight: 300,
                color: 'var(--ocean)',
                lineHeight: 1.1,
              }}
            >
              {t('food.title')}
            </h2>
            <p style={{ color: 'var(--ink)', opacity: 0.6, maxWidth: '520px', margin: '0 auto', lineHeight: 1.7 }}>
              {t('food.subtitle')}
            </p>
          </motion.div>

          {foodItems && (
            <div>
              <FoodCategory
                labelKey="food.localGems"
                items={foodItems.localGems || []}
                accent="var(--sand)"
                icon={Star}
                onImageClick={(photo, name) => setLightbox({ url: photo, alt: name })}
              />
              <FoodCategory
                labelKey="food.splurge"
                items={foodItems.splurge || []}
                accent="var(--coral)"
                icon={UtensilsCrossed}
                onImageClick={(photo, name) => setLightbox({ url: photo, alt: name })}
              />
              <FoodCategory
                labelKey="food.casual"
                items={foodItems.casual || []}
                accent="var(--ocean)"
                icon={MapPin}
                onImageClick={(photo, name) => setLightbox({ url: photo, alt: name })}
              />
            </div>
          )}
        </motion.div>
      </div>
      <ImageLightbox
        src={lightbox.url || ''}
        alt={lightbox.alt}
        isOpen={!!lightbox.url}
        onClose={() => setLightbox({ url: null, alt: '' })}
      />
    </section>
  )
}
