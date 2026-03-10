import Nav from './components/Nav'
import Hero from './components/Hero'
import TripOverview from './components/TripOverview'
import Itinerary from './components/Itinerary'
import BeachGuide from './components/BeachGuide'
import FoodGuide from './components/FoodGuide'
import PracticalTips from './components/PracticalTips'
import ChatWidget from './components/ChatWidget'

export default function App() {
  return (
    <div style={{ fontFamily: 'var(--font-body)', color: 'var(--ink)', background: 'var(--ivory)' }}>
      <Nav />
      <Hero />
      <TripOverview />
      <Itinerary />
      <BeachGuide />
      <FoodGuide />
      <PracticalTips />
      <ChatWidget />
    </div>
  )
}
