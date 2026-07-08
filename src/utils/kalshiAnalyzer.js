/**
 * Kalshi ITF Tennis Market Analyzer
 * Finds mispriced ITF tennis markets with upcoming games
 */

const KALSHI_API_BASE = 'https://trading-api.kalshi.com/trade-api/v2'

export class KalshiAnalyzer {
  constructor(apiKey) {
    this.apiKey = apiKey
  }

  /**
   * Fetch all ITF tennis markets from Kalshi
   */
  async getITFMarkets() {
    try {
      const response = await fetch(`${KALSHI_API_BASE}/markets?ticker_prefix=ITF`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) throw new Error(`API error: ${response.status}`)
      return await response.json()
    } catch (error) {
      console.error('Failed to fetch ITF markets:', error)
      throw error
    }
  }

  /**
   * Get markets with games happening today
   */
  async getTodayMatches(markets) {
    const now = new Date()
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000)

    return markets.filter(market => {
      const eventTime = new Date(market.event_date)
      return eventTime >= todayStart && eventTime < todayEnd && market.status === 'open'
    })
  }

  /**
   * Detect potentially mispriced markets
   * Mispricing indicators:
   * - Illiquid markets (low trading volume)
   * - Large bid-ask spreads (>5%)
   * - Odds that don't sum to ~100% (accounting for vig)
   */
  analyzePricing(market) {
    const analysis = {
      ticker: market.ticker,
      title: market.title,
      eventTime: market.event_date,
      isLiquid: false,
      spreadPercent: 0,
      oddsSumPercent: 0,
      mispricingScore: 0,
      concerns: []
    }

    // Check volume
    const totalVolume = (market.yes_ask_price || 0) + (market.no_ask_price || 0)
    if (totalVolume < 1000) {
      analysis.concerns.push(`Low volume (${totalVolume})`)
      analysis.mispricingScore += 2
    } else {
      analysis.isLiquid = true
    }

    // Check spread
    const yesSpread = market.yes_ask_price - market.yes_bid_price
    const noSpread = market.no_ask_price - market.no_bid_price
    const avgSpread = (yesSpread + noSpread) / 2
    analysis.spreadPercent = avgSpread

    if (avgSpread > 0.05) {
      analysis.concerns.push(`Wide spread (${(avgSpread * 100).toFixed(1)}%)`)
      analysis.mispricingScore += 1.5
    }

    // Check if odds sum correctly
    const yesProbability = market.last_yes_price
    const noProbability = 1 - yesProbability
    const oddSum = yesProbability + noProbability
    analysis.oddsSumPercent = oddSum * 100

    if (oddSum > 1.02 || oddSum < 0.95) {
      analysis.concerns.push(`Odd odds sum: ${(oddSum * 100).toFixed(1)}%`)
      analysis.mispricingScore += 2
    }

    return analysis
  }

  /**
   * Main function: find mispriced ITF matches today
   */
  async findMispricedMatches() {
    console.log('Fetching ITF tennis markets...')
    const allMarkets = await this.getITFMarkets()

    console.log(`Found ${allMarkets.length} ITF markets`)
    const todayMatches = await this.getTodayMatches(allMarkets)

    console.log(`${todayMatches.length} matches today`)

    // Analyze each market
    const analyzed = todayMatches.map(m => this.analyzePricing(m))

    // Sort by mispricing score (highest first)
    const sorted = analyzed.sort((a, b) => b.mispricingScore - a.mispricingScore)

    // Return markets with score > 2 (notable mispricing)
    return sorted.filter(m => m.mispricingScore > 2)
  }
}

export default KalshiAnalyzer
