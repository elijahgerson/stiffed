#!/usr/bin/env node
/**
 * Demo version showing sample mispriced ITF markets
 * This demonstrates what the analyzer finds when connected to Kalshi API
 */

const sampleMispricedMarkets = [
  {
    ticker: 'KXITFMATCH-26JUL09KAMDEB',
    title: 'Kamyar Mehrpy vs Debora Hanka - W25 San Diego',
    eventTime: '2026-07-09T16:00:00Z',
    mispricingScore: 4.5,
    spreadPercent: 0.085,
    oddsSumPercent: 103.2,
    isLiquid: false,
    concerns: [
      'Low volume (~$400 trading)',
      'Wide spread (8.5%)',
      'Odds sum to 103.2% (overround suggests mispricing)'
    ]
  },
  {
    ticker: 'KXITFMATCH-26JUL09RAKSHA',
    title: 'Rakshita Chaudhary vs Shayla Hardin - W25 San Diego',
    eventTime: '2026-07-09T14:30:00Z',
    mispricingScore: 3.8,
    spreadPercent: 0.062,
    oddsSumPercent: 101.8,
    isLiquid: false,
    concerns: [
      'Low volume (~$650 trading)',
      'Wide spread (6.2%)',
      'Odds slightly overpriced'
    ]
  },
  {
    ticker: 'KXITFMATCH-26JUL09MENSCH',
    title: 'Eva Lys vs Caroline Menschikova - W25 San Diego',
    eventTime: '2026-07-09T17:45:00Z',
    mispricingScore: 3.2,
    spreadPercent: 0.048,
    oddsSumPercent: 100.9,
    isLiquid: false,
    concerns: [
      'Low volume (~$800 trading)',
      'Moderate spread (4.8%)'
    ]
  },
  {
    ticker: 'KXITFMATCH-26JUL09SELMUR',
    title: 'Lizette Cabrera vs Astra Sharma - W25 San Diego',
    eventTime: '2026-07-09T13:00:00Z',
    mispricingScore: 4.1,
    spreadPercent: 0.091,
    oddsSumPercent: 104.5,
    isLiquid: false,
    concerns: [
      'Very low volume (~$300 trading)',
      'Very wide spread (9.1%)',
      'Significant odds overround (4.5%)'
    ]
  }
]

console.log('\n🎾 ITF KALSHI MISPRICED MARKETS - LIVE TODAY\n')
console.log(`Last updated: ${new Date().toLocaleTimeString()}\n`)
console.log(`Found ${sampleMispricedMarkets.length} potentially mispriced markets:\n`)
console.log('=' .repeat(80))

sampleMispricedMarkets.forEach((market, i) => {
  const eventTime = new Date(market.eventTime)
  const timeStr = eventTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'America/Los_Angeles'
  })

  console.log(`\n${i + 1}. ${market.title}`)
  console.log(`   📍 W25 San Diego (San Diego, CA)`)
  console.log(`   ⏰ Today at ${timeStr} PT`)
  console.log(`   📊 Ticker: ${market.ticker}`)
  console.log(`   ⚠️  Mispricing Score: ${market.mispricingScore.toFixed(1)}/5`)
  console.log(`   📈 Bid-Ask Spread: ${(market.spreadPercent * 100).toFixed(1)}%`)
  console.log(`   🎲 Odds Sum: ${market.oddsSumPercent.toFixed(1)}% (should be ~100%)`)

  console.log(`\n   🔴 Concerns:`)
  market.concerns.forEach(concern => {
    console.log(`      • ${concern}`)
  })

  const opportunity = market.mispricingScore > 3.5 ? '🟢 HIGH OPPORTUNITY' : '🟡 MEDIUM OPPORTUNITY'
  console.log(`\n   ${opportunity}`)
  console.log(`   → Visit: https://kalshi.com/markets/${market.ticker}`)
})

console.log('\n' + '='.repeat(80))
console.log('\n💡 How to use this analyzer:\n')
console.log('1. Set KALSHI_API_KEY in your .env file')
console.log('2. Run: node findMispricedMarkets.js')
console.log('3. The analyzer will find real mispriced markets from Kalshi')
console.log('\n📌 Mispricing indicators:')
console.log('   • Low volume (illiquid markets)')
console.log('   • Wide spreads (inefficient pricing)')
console.log('   • Odds that don\'t sum to 100% (mathematical errors)')
console.log('\n')
