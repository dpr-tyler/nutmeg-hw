import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Sun, Plane, MapPin, Building } from 'lucide-react'
import ImageLightbox from './ImageLightbox'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
}

function InfoCard({ icon: Icon, title, children, delay = 0 }) {
  return (
    <motion.div
      variants={fadeUp}
      className="rounded-2xl p-7 flex flex-col gap-4"
      style={{ background: 'var(--mist)', border: '1px solid rgba(27,79,107,0.08)' }}
    >
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: 'rgba(27,79,107,0.1)' }}
      >
        <Icon size={22} color="var(--ocean)" strokeWidth={1.5} />
      </div>
      <div>
        <h3
          className="font-display text-xl mb-2"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--ocean)', fontWeight: 600 }}
        >
          {title}
        </h3>
        <p style={{ color: 'var(--ink)', opacity: 0.75, lineHeight: 1.7, fontSize: '0.9rem' }}>
          {children}
        </p>
      </div>
    </motion.div>
  )
}

function NeighborhoodCard({ name, desc, index, photo, onImageClick }) {
  const colors = ['var(--ocean)', 'var(--coral)', 'var(--sand)']
  return (
    <motion.div
      variants={fadeUp}
      className="rounded-2xl p-6 flex flex-col gap-3"
      style={{
        background: 'white',
        border: `2px solid ${colors[index]}20`,
        boxShadow: `0 4px 24px ${colors[index]}12`,
      }}
    >
      <div
        className="w-8 h-1 rounded-full"
        style={{ background: colors[index] }}
      />
      {photo && (
        <img
          src={photo}
          alt={name}
          onClick={() => onImageClick(photo, name)}
          className="rounded-xl object-cover"
          style={{ width: 72, height: 72, cursor: 'zoom-in' }}
        />
      )}
      <h4
        className="font-display text-lg"
        style={{ fontFamily: 'var(--font-display)', color: 'var(--ink)', fontWeight: 600 }}
      >
        {name}
      </h4>
      <p style={{ color: 'var(--ink)', opacity: 0.7, fontSize: '0.875rem', lineHeight: 1.7 }}>
        {desc}
      </p>
    </motion.div>
  )
}

export default function TripOverview() {
  const { t } = useTranslation()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const [lightbox, setLightbox] = useState({ url: null, alt: '' })

  const neighborhoodPhotos = {
    waikiki: 'https://images.unsplash.com/photo-1598135753163-6167c1a1ad65?w=80&h=80&fit=crop&auto=format',
    kailua: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=80&h=80&fit=crop&auto=format',
    northShore: 'https://images.unsplash.com/photo-1455156218388-5e61b526818b?w=80&h=80&fit=crop&auto=format',
  }

  const neighborhoods = [
    { key: 'waikiki', icon: Building },
    { key: 'kailua', icon: MapPin },
    { key: 'northShore', icon: Sun },
  ]

  return (
    <section id="overview" ref={ref} className="py-24 px-6" style={{ background: 'var(--ivory)' }}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          <motion.div variants={fadeUp} className="mb-16 text-center">
            <span
              className="inline-block text-xs tracking-widest uppercase mb-4"
              style={{
                fontFamily: 'var(--font-mono)',
                color: 'var(--sand)',
                letterSpacing: '0.2em',
              }}
            >
              Plan Your Trip
            </span>
            <h2
              className="font-display"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                fontWeight: 300,
                color: 'var(--ocean)',
                lineHeight: 1.1,
              }}
            >
              {t('overview.title')}
            </h2>
          </motion.div>

          {/* Info cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <InfoCard icon={Sun} title={t('overview.bestTime.title')}>
              {t('overview.bestTime.body')}
            </InfoCard>
            <InfoCard icon={Plane} title={t('overview.getting.title')}>
              {t('overview.getting.body')}
            </InfoCard>
          </div>

          {/* Neighborhoods */}
          <motion.div variants={fadeUp} className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <MapPin size={18} color="var(--coral)" />
              <h3
                className="font-display text-2xl"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--ink)', fontWeight: 600 }}
              >
                {t('overview.neighborhoods.title')}
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {['waikiki', 'kailua', 'northShore'].map((key, i) => (
                <NeighborhoodCard
                  key={key}
                  name={t(`overview.neighborhoods.${key}.name`)}
                  desc={t(`overview.neighborhoods.${key}.desc`)}
                  index={i}
                  photo={neighborhoodPhotos[key]}
                  onImageClick={(url, alt) => setLightbox({ url, alt })}
                />
              ))}
            </div>
          </motion.div>
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
