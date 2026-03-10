export function getGoogleMapsUrl(name, location) {
  const query = [name, location, 'Oahu Hawaii'].filter(Boolean).join(' ')
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`
}
