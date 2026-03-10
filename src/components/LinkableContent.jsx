import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { buildEntityRegistry, parseTextWithEntities } from '../utils/entityMatch'

export default function LinkableContent({ text, onEntityClick }) {
  const { t } = useTranslation()

  const beaches = t('beaches.list', { returnObjects: true })
  const foodItems = t('food.items', { returnObjects: true })
  const locationItems = t('locations.items', { returnObjects: true }) || {}
  const locations = [
    ...(locationItems.nature || []),
    ...(locationItems.shopping || []),
  ]

  const segments = useMemo(() => {
    const entities = buildEntityRegistry(beaches, foodItems, locations)
    return parseTextWithEntities(text, entities)
  }, [text, beaches, foodItems, locations])

  return (
    <>
      {segments.map((seg, i) => {
        if (seg.type === 'text') {
          return <span key={i}>{seg.value}</span>
        }
        const { entity, matchedText } = seg
        return (
          <button
            key={i}
            type="button"
            onClick={(e) => {
              e.preventDefault()
              onEntityClick?.(entity)
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onEntityClick?.(entity)
              }
            }}
            className="inline cursor-pointer border-b border-current hover:opacity-80 transition-opacity"
            style={{
              color: 'var(--ocean)',
              background: 'none',
              padding: 0,
              font: 'inherit',
              textDecoration: 'none',
            }}
            aria-label={t('ui.aria.viewDetails', { name: entity.name })}
          >
            {matchedText}
          </button>
        )
      })}
    </>
  )
}
