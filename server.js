import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import Anthropic from '@anthropic-ai/sdk'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { existsSync } from 'fs'

dotenv.config()
const __dirname = dirname(fileURLToPath(import.meta.url))
const app = express()
app.use(cors())
app.use(express.json())

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

app.post('/api/score', async (req, res) => {
  const { jobTitle, context } = req.body
  if (!jobTitle) return res.status(400).json({ error: 'jobTitle required' })

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
    console.error('Score error:', err.message)
    res.status(500).json({ error: err.message })
  }
})

// Serve React build in production
const buildPath = join(__dirname, 'client', 'dist')
if (existsSync(buildPath)) {
  app.use(express.static(buildPath))
  app.get('*', (_, res) => res.sendFile(join(buildPath, 'index.html')))
}

const PORT = process.env.PORT || 3002
app.listen(PORT, () => console.log(`KarmaMap server running on port ${PORT}`))
