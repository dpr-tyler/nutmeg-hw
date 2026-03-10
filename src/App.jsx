import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Itinerary from './components/Itinerary'
import BeachGuide from './components/BeachGuide'
import LocationsGuide from './components/LocationsGuide'
import FoodGuide from './components/FoodGuide'
import PracticalTips from './components/PracticalTips'
import ChatWidget from './components/ChatWidget'

export default function App() {
  const { i18n } = useTranslation()
  useEffect(() => {
    document.documentElement.lang = i18n.language
  }, [i18n.language])

  return (
    <div style={{ fontFamily: 'var(--font-body)', color: 'var(--ink)', background: 'var(--ivory)' }}>
      <Nav />
      <Hero />
      <Itinerary />
      <BeachGuide />
      <LocationsGuide />
      <FoodGuide />
      <PracticalTips />
      <ChatWidget />
    </div>
  )
}
