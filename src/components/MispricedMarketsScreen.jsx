import React, { useState, useEffect } from 'react'
import '../styles/MispricedMarketsScreen.css'

export function MispricedMarketsScreen() {
  const [markets, setMarkets] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [timestamp, setTimestamp] = useState(null)

  const fetchMispricedMarkets = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/kalshi/mispriced-itf')
      if (!response.ok) throw new Error(`API error: ${response.status}`)

      const data = await response.json()
      setMarkets(data.matches || [])
      setTimestamp(data.timestamp)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMispricedMarkets()
    const interval = setInterval(fetchMispricedMarkets, 60000) // Refresh every minute
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="mispriced-markets-screen">
      <div className="header">
        <h1>🎾 ITF Kalshi Mispriced Markets</h1>
        <button onClick={fetchMispricedMarkets} disabled={loading} className="refresh-btn">
          {loading ? 'Searching...' : 'Refresh'}
        </button>
      </div>

      {timestamp && (
        <p className="timestamp">Last updated: {new Date(timestamp).toLocaleTimeString()}</p>
      )}

      {error && (
        <div className="error-banner">
          {error}
        </div>
      )}

      {loading && !markets.length && (
        <div className="loading">Analyzing Kalshi markets...</div>
      )}

      {markets.length === 0 && !loading && !error && (
        <div className="no-markets">
          No mispriced markets found at this time.
        </div>
      )}

      <div className="markets-grid">
        {markets.map((market, idx) => (
          <div key={`${market.ticker}-${idx}`} className="market-card">
            <div className="market-header">
              <h3>{market.title}</h3>
              <span className="ticker">{market.ticker}</span>
            </div>

            <div className="market-details">
              <div className="detail-row">
                <span className="label">Event Time:</span>
                <span className="value">
                  {new Date(market.eventTime).toLocaleString()}
                </span>
              </div>

              <div className="detail-row">
                <span className="label">Mispricing Score:</span>
                <span className={`value score score-${Math.ceil(market.mispricingScore)}`}>
                  {market.mispricingScore.toFixed(2)}/5
                </span>
              </div>

              <div className="detail-row">
                <span className="label">Bid-Ask Spread:</span>
                <span className="value">
                  {(market.spreadPercent * 100).toFixed(2)}%
                </span>
              </div>

              {market.concerns.length > 0 && (
                <div className="concerns">
                  <span className="label">Concerns:</span>
                  <ul>
                    {market.concerns.map((concern, i) => (
                      <li key={i}>{concern}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="market-footer">
              <a
                href={`https://kalshi.com/markets/${market.ticker}`}
                target="_blank"
                rel="noopener noreferrer"
                className="trade-btn"
              >
                View on Kalshi →
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MispricedMarketsScreen
