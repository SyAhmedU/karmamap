import Anthropic from '@anthropic-ai/sdk'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { jobTitle, context } = req.body
  if (!jobTitle) return res.status(400).json({ error: 'jobTitle required' })

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

  try {
    const message = await client.messages.create({
      model: 'claude-opus-4-7',
      max_tokens: 512,
      messages: [{
        role: 'user',
        content: `You are an expert labour economist specialising in India. Score the following job for the Indian market and return ONLY valid JSON with no markdown.

Job title: "${jobTitle}"
${context ? `Context: ${context}` : ''}

Return exactly this JSON structure:
{
  "growthPct": <number, 5-year CAGR % for this role in India, can be negative>,
  "medianSalaryINR": <number, monthly median salary in INR for India 2024>,
  "educationYears": <number, typical years of formal education required>,
  "aiExposure": <number 0-100, how exposed this role is to AI automation (100 = highly exposed)>,
  "outlook": <string, 1-2 sentence assessment of this role's future in India>,
  "rationale": <string, brief justification for the scores>
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
