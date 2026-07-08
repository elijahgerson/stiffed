#!/usr/bin/env node
/**
 * CLI tool to find mispriced ITF Kalshi tennis markets
 * Usage: node findMispricedMarkets.js [--output json|csv|text]
 */

import 'dotenv/config'
import KalshiAnalyzer from './src/utils/kalshiAnalyzer.js'

const apiKey = process.env.KALSHI_API_KEY
if (!apiKey) {
  console.error('Error: KALSHI_API_KEY environment variable not set')
  process.exit(1)
}

const outputFormat = process.argv[2]?.replace('--output', '').trim() || 'text'

async function main() {
  try {
    console.log('🎾 Finding mispriced ITF Kalshi tennis markets...\n')

    const analyzer = new KalshiAnalyzer(apiKey)
    const mispricedMatches = await analyzer.findMispricedMatches()

    if (mispricedMatches.length === 0) {
      console.log('No mispriced markets found at this time.')
      return
    }

    if (outputFormat === 'json') {
      console.log(JSON.stringify(mispricedMatches, null, 2))
    } else if (outputFormat === 'csv') {
      console.log('Ticker,Title,Event Time,Mispricing Score,Spread %,Concerns')
      mispricedMatches.forEach(m => {
        const concerns = m.concerns.join('; ')
        console.log(`"${m.ticker}","${m.title}","${m.eventTime}",${m.mispricingScore.toFixed(2)},${m.spreadPercent.toFixed(2)},${concerns}`)
      })
    } else {
      // Default text output
      console.log(`Found ${mispricedMatches.length} potentially mispriced markets:\n`)
      mispricedMatches.slice(0, 10).forEach((match, i) => {
        console.log(`${i + 1}. ${match.title}`)
        console.log(`   Ticker: ${match.ticker}`)
        console.log(`   Event: ${new Date(match.eventTime).toLocaleString()}`)
        console.log(`   Mispricing Score: ${match.mispricingScore.toFixed(2)}/5`)
        console.log(`   Spread: ${(match.spreadPercent * 100).toFixed(2)}%`)
        if (match.concerns.length > 0) {
          console.log(`   Concerns: ${match.concerns.join(', ')}`)
        }
        console.log()
      })

      if (mispricedMatches.length > 10) {
        console.log(`... and ${mispricedMatches.length - 10} more matches`)
      }
    }
  } catch (error) {
    console.error('Error:', error.message)
    process.exit(1)
  }
}

main()
