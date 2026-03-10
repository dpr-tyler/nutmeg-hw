/**
 * Builds a flat list of entities (beaches + food + locations) from locale data for matching in itinerary text.
 * Each entity has: { id, name, type: 'beach'|'food'|'location', data, searchTerms }
 * searchTerms = [name, ...aliases] - all strings that can match in text
 */
export function buildEntityRegistry(beaches, foodItems, locations) {
  const entities = []

  if (Array.isArray(beaches)) {
    for (const beach of beaches) {
      const searchTerms = [beach.name]
      if (beach.aliases && Array.isArray(beach.aliases)) {
        searchTerms.push(...beach.aliases)
      }
      entities.push({
        id: `beach:${beach.name}`,
        name: beach.name,
        type: 'beach',
        data: beach,
        searchTerms,
      })
    }
  }

  if (foodItems && typeof foodItems === 'object') {
    const categories = ['localGems', 'splurge', 'casual']
    for (const cat of categories) {
      const items = foodItems[cat] || []
      for (const item of items) {
        const searchTerms = [item.name]
        if (item.aliases && Array.isArray(item.aliases)) {
          searchTerms.push(...item.aliases)
        }
        entities.push({
          id: `food:${item.name}`,
          name: item.name,
          type: 'food',
          data: item,
          searchTerms,
        })
      }
    }
  }

  if (Array.isArray(locations)) {
    for (const loc of locations) {
      const searchTerms = [loc.name]
      if (loc.aliases && Array.isArray(loc.aliases)) {
        searchTerms.push(...loc.aliases)
      }
      entities.push({
        id: `location:${loc.name}`,
        name: loc.name,
        type: 'location',
        data: loc,
        searchTerms,
      })
    }
  }

  // Sort by longest search term first so "Waikiki Beach" matches before "Waikiki"
  entities.sort((a, b) => {
    const maxLenA = Math.max(...a.searchTerms.map((t) => t.length))
    const maxLenB = Math.max(...b.searchTerms.map((t) => t.length))
    return maxLenB - maxLenA
  })

  return entities
}

/**
 * Finds all non-overlapping entity matches in text.
 * Returns array of { type: 'text'|'entity', value: string|entity }
 */
export function parseTextWithEntities(text, entities) {
  if (!text || typeof text !== 'string') {
    return [{ type: 'text', value: '' }]
  }

  const segments = []
  const usedRanges = [] // [{ start, end }] - ranges already matched

  for (const entity of entities) {
    for (const term of entity.searchTerms) {
      if (!term || term.length === 0) continue

      let pos = 0
      while (true) {
        const idx = text.indexOf(term, pos)
        if (idx === -1) break

        const end = idx + term.length

        // Skip if this range overlaps with an existing match
        const overlaps = usedRanges.some(
          (r) => (idx >= r.start && idx < r.end) || (end > r.start && end <= r.end) || (idx <= r.start && end >= r.end)
        )
        if (!overlaps) {
          usedRanges.push({ start: idx, end })
          segments.push({ type: 'entity', entity, matchedText: term, start: idx, end })
        }

        pos = idx + 1
      }
    }
  }

  // Sort by start position
  segments.sort((a, b) => a.start - b.start)

  // Build result: interleave text and entity segments
  const result = []
  let lastEnd = 0

  for (const seg of segments) {
    if (seg.start > lastEnd) {
      result.push({ type: 'text', value: text.slice(lastEnd, seg.start) })
    }
    result.push({ type: 'entity', entity: seg.entity, matchedText: seg.matchedText })
    lastEnd = seg.end
  }

  if (lastEnd < text.length) {
    result.push({ type: 'text', value: text.slice(lastEnd) })
  }

  return result.length > 0 ? result : [{ type: 'text', value: text }]
}
