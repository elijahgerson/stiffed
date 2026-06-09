import { useState, useEffect } from 'react'
import LandingScreen from './components/LandingScreen.jsx'
import ClaimForm from './components/ClaimForm.jsx'
import StatusScreen from './components/StatusScreen.jsx'

export default function App() {
  const [screen, setScreen] = useState('landing')
  const [claimId, setClaimId] = useState(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const claim = params.get('claim')
    const success = params.get('success')
    if (claim && success) {
      setClaimId(claim)
      setScreen('status')
    }
  }, [])

  if (screen === 'status') return <StatusScreen claimId={claimId} />
  if (screen === 'form') return <ClaimForm onBack={() => setScreen('landing')} />
  return <LandingScreen onStart={() => setScreen('form')} />
}
