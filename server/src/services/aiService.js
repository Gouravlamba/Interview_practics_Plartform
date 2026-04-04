import { config } from '../config/index.js'

const MOCK_RESPONSES = [
  'Good answer. Try structuring it with edge cases, time complexity, and a quick example for clarity.',
  'Excellent approach! How would you handle the edge case where the input array contains only one element?',
  "That's a solid foundation. Consider discussing the trade-offs between time and space complexity.",
  'Good thinking. Could you walk me through the time complexity of your solution?',
  'Nice. How would this solution scale with very large inputs?',
  "Well explained. Let's dig deeper — what data structures would you consider for optimizing this?",
  'Interesting approach. Have you considered using dynamic programming here?',
  "That's correct. Now, how would you test this function? What edge cases would you cover?",
]

function getMockResponse() {
  return MOCK_RESPONSES[Math.floor(Math.random() * MOCK_RESPONSES.length)]
}

let openaiClient = null

async function getOpenAIClient() {
  if (!config.openai.apiKey) return null
  if (!openaiClient) {
    try {
      const { default: OpenAI } = await import('openai')
      openaiClient = new OpenAI({ apiKey: config.openai.apiKey })
    } catch {
      return null
    }
  }
  return openaiClient
}

export async function getAIInsight(userMessage, context = {}) {
  const client = await getOpenAIClient()

  if (!client) {
    return { text: getMockResponse(), provider: 'mock' }
  }

  try {
    const systemPrompt = buildSystemPrompt(context)
    const completion = await client.chat.completions.create({
      model: config.openai.model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
      ],
      max_tokens: 300,
      temperature: 0.7,
    })

    return {
      text: completion.choices[0]?.message?.content?.trim() || getMockResponse(),
      provider: 'openai',
    }
  } catch (err) {
    console.error('[AI Service] OpenAI error, falling back to mock:', err.message)
    return { text: getMockResponse(), provider: 'mock' }
  }
}

export async function generateQuestions(context = {}) {
  const client = await getOpenAIClient()

  if (!client) {
    return {
      questions: getMockQuestions(context.persona),
      provider: 'mock',
    }
  }

  try {
    const prompt = `Generate 5 interview questions for a ${context.persona || 'Software Engineer'} position.
    Job Description: ${context.jobDescription || 'Not provided'}
    Difficulty: ${context.difficulty || 'medium'}
    
    Return JSON: { "questions": [{ "text": "...", "category": "technical|behavioral|general", "difficulty": "easy|medium|hard" }] }`

    const completion = await client.chat.completions.create({
      model: config.openai.model,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 600,
      temperature: 0.8,
      response_format: { type: 'json_object' },
    })

    const parsed = JSON.parse(completion.choices[0]?.message?.content || '{}')
    return { questions: parsed.questions || getMockQuestions(context.persona), provider: 'openai' }
  } catch {
    return { questions: getMockQuestions(context.persona), provider: 'mock' }
  }
}

export async function generatePerformanceFeedback(messages = [], code = '') {
  const client = await getOpenAIClient()

  if (!client) {
    return {
      feedback: getMockFeedback(),
      provider: 'mock',
    }
  }

  try {
    const transcript = messages
      .slice(-10)
      .map((m) => `${m.sender === 'user' ? 'Candidate' : 'AI'}: ${m.text}`)
      .join('\n')

    const prompt = `Analyze this interview transcript and provide performance scores (0-100) and feedback.
    
Transcript:
${transcript}

${code ? `Code submitted:\n${code}` : ''}

Return JSON: {
  "scores": { "technicalAccuracy": 0-100, "communication": 0-100, "confidence": 0-100, "coding": 0-100, "problemSolving": 0-100, "systemDesign": 0-100, "leadership": 0-100, "overallScore": 0-100 },
  "strengths": ["..."],
  "weaknesses": ["..."],
  "suggestions": ["..."]
}`

    const completion = await client.chat.completions.create({
      model: config.openai.model,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 600,
      temperature: 0.5,
      response_format: { type: 'json_object' },
    })

    const parsed = JSON.parse(completion.choices[0]?.message?.content || '{}')
    return { feedback: parsed, provider: 'openai' }
  } catch {
    return { feedback: getMockFeedback(), provider: 'mock' }
  }
}

function buildSystemPrompt(context) {
  return `You are an AI interviewer acting as a ${context.persona || 'Senior Tech Lead'}.
You are conducting a technical interview. Give concise, constructive feedback on the candidate's answer.
Keep responses under 3 sentences. Be encouraging but professional.`
}

function getMockQuestions(persona = 'Senior Tech Lead') {
  const questions = {
    'Senior Tech Lead': [
      { text: 'Explain the time complexity of quicksort and when you would avoid it.', category: 'technical', difficulty: 'medium' },
      { text: 'Design a URL shortening service like bit.ly.', category: 'system-design', difficulty: 'hard' },
      { text: 'How do you handle technical debt in a fast-paced team?', category: 'behavioral', difficulty: 'medium' },
      { text: 'Implement a function to find the two numbers in an array that sum to a target.', category: 'technical', difficulty: 'easy' },
      { text: 'Walk me through how you would approach debugging a production memory leak.', category: 'technical', difficulty: 'hard' },
    ],
    'HR Manager': [
      { text: 'Tell me about yourself and your career journey.', category: 'behavioral', difficulty: 'easy' },
      { text: 'Describe a situation where you had to resolve a conflict with a colleague.', category: 'behavioral', difficulty: 'medium' },
      { text: "What are your greatest strengths and how do they relate to this role?", category: 'behavioral', difficulty: 'easy' },
      { text: 'Where do you see yourself in 5 years?', category: 'behavioral', difficulty: 'easy' },
      { text: 'Tell me about a time you failed. What did you learn?', category: 'behavioral', difficulty: 'medium' },
    ],
    'Startup Founder': [
      { text: 'How would you validate a product idea with minimal resources?', category: 'product', difficulty: 'medium' },
      { text: 'Describe a time you had to pivot quickly. How did you handle it?', category: 'behavioral', difficulty: 'hard' },
      { text: 'How do you prioritize features when everything seems urgent?', category: 'product', difficulty: 'medium' },
      { text: 'What metrics would you track for a new SaaS product?', category: 'product', difficulty: 'medium' },
      { text: 'How do you build a team culture in a remote-first startup?', category: 'behavioral', difficulty: 'easy' },
    ],
  }

  return questions[persona] || questions['Senior Tech Lead']
}

function getMockFeedback() {
  return {
    scores: {
      technicalAccuracy: 82,
      communication: 75,
      confidence: 70,
      coding: 85,
      problemSolving: 80,
      systemDesign: 72,
      leadership: 65,
      overallScore: 76,
    },
    strengths: [
      'Clear articulation of technical concepts',
      'Good understanding of data structures',
      'Methodical problem-solving approach',
    ],
    weaknesses: [
      'Could provide more concrete examples',
      'System design explanations need more depth',
      'Consider discussing trade-offs more explicitly',
    ],
    suggestions: [
      'Practice the STAR method for behavioral questions',
      'Review distributed systems concepts',
      'Work on time complexity analysis',
    ],
  }
}
