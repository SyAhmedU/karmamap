import Anthropic from '@anthropic-ai/sdk'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { occupation, sector, metrics, region } = req.body
  if (!occupation) return res.status(400).json({ error: 'occupation required' })

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

  const isIndia = region !== 'world'
  const salLabel = isIndia
    ? (metrics.salaryINR ? `₹${Math.round(metrics.salaryINR / 1000)}K/mo` : 'unknown')
    : (metrics.salaryUSD ? `$${Math.round(metrics.salaryUSD)}/mo` : 'unknown')

  try {
    const message = await client.messages.create({
      model: 'claude-opus-4-7',
      max_tokens: 400,
      messages: [{
        role: 'user',
        content: `You are a senior labour economist. Analyse the 2035 outlook for this occupation and return ONLY valid JSON with no markdown or explanation.

Occupation: "${occupation}"
Sector: "${sector}"
Market: ${isIndia ? 'India' : 'Global'}
Current metrics (${new Date().getFullYear()}):
- AI Exposure: ${metrics.aiExposure ?? 'unknown'}/100
- Digital Intensity: ${metrics.digitalIntensity ?? 'unknown'}/100
- AI Displacement Risk: ${metrics.displacementRisk ?? 'unknown'}/100
- Growth rate: ${metrics.growthPct != null ? `${metrics.growthPct > 0 ? '+' : ''}${metrics.growthPct}%/yr` : 'unknown'}
- Median salary: ${salLabel}
- Workforce: ${metrics.workers ? `${(metrics.workers / 1e6).toFixed(1)}M` : 'unknown'}

Return exactly this JSON:
{
  "verdict": "<one of: THRIVING | STABLE | AT_RISK | DISRUPTED>",
  "headline": "<8-10 word punchy headline for this job's 2035 outlook>",
  "detail": "<2-3 sentences: what specifically changes by 2035, what skill pivots protect workers, any India-specific nuance>",
  "workerAdvice": "<1 sentence: the single most important action a worker in this role should take today>"
}`
      }]
    })

    const text = message.content[0].text.trim()
    const json = JSON.parse(text)
    res.json(json)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
