import InterviewSession from '../models/InterviewSession.js'

const MOCK_RADAR = [
  { subject: 'Coding', value: 88 },
  { subject: 'Problem Solving', value: 82 },
  { subject: 'Communication', value: 69 },
  { subject: 'System Design', value: 78 },
  { subject: 'Leadership', value: 72 },
]

const MOCK_TREND = [
  { session: 'Session 1', score: 10 },
  { session: 'Session 2', score: 25 },
  { session: 'Session 3', score: 42 },
  { session: 'Session 4', score: 61 },
  { session: 'Session 5', score: 80 },
]

export async function getDashboardAnalytics(req, res, next) {
  try {
    const userId = req.user._id

    const [totalSessions, completedSessions, recentCompleted] = await Promise.all([
      InterviewSession.countDocuments({ userId }),
      InterviewSession.countDocuments({ userId, status: 'completed' }),
      InterviewSession.find({ userId, status: 'completed' })
        .sort({ endedAt: -1 })
        .limit(5)
        .select('performance.overallScore persona endedAt'),
    ])

    let radarData = MOCK_RADAR
    let avgOverall = 0

    if (completedSessions > 0) {
      const agg = await InterviewSession.aggregate([
        { $match: { userId: req.user._id, status: 'completed' } },
        {
          $group: {
            _id: null,
            avgCoding: { $avg: '$performance.coding' },
            avgProblemSolving: { $avg: '$performance.problemSolving' },
            avgCommunication: { $avg: '$performance.communication' },
            avgSystemDesign: { $avg: '$performance.systemDesign' },
            avgLeadership: { $avg: '$performance.leadership' },
            avgOverall: { $avg: '$performance.overallScore' },
          },
        },
      ])

      if (agg.length > 0) {
        const a = agg[0]
        avgOverall = Math.round(a.avgOverall || 0)
        radarData = [
          { subject: 'Coding', value: Math.round(a.avgCoding || 0) },
          { subject: 'Problem Solving', value: Math.round(a.avgProblemSolving || 0) },
          { subject: 'Communication', value: Math.round(a.avgCommunication || 0) },
          { subject: 'System Design', value: Math.round(a.avgSystemDesign || 0) },
          { subject: 'Leadership', value: Math.round(a.avgLeadership || 0) },
        ]
      }
    }

    res.json({
      success: true,
      data: {
        totalSessions,
        completedSessions,
        avgOverall,
        radarData,
        recentCompleted,
      },
    })
  } catch (err) {
    next(err)
  }
}

export async function getPerformanceTrend(req, res, next) {
  try {
    const userId = req.user._id
    const limit = Math.min(20, parseInt(req.query.limit) || 10)

    const sessions = await InterviewSession.find({ userId, status: 'completed' })
      .sort({ endedAt: 1 })
      .limit(limit)
      .select('performance.overallScore performance.technicalAccuracy performance.communication persona endedAt createdAt')

    if (sessions.length === 0) {
      return res.json({ success: true, data: { trend: MOCK_TREND, stats: getDefaultStats() } })
    }

    const trend = sessions.map((s, i) => ({
      session: `Session ${i + 1}`,
      score: s.performance?.overallScore || 0,
      technical: s.performance?.technicalAccuracy || 0,
      communication: s.performance?.communication || 0,
      date: s.endedAt || s.createdAt,
      persona: s.persona,
    }))

    const latest = sessions[sessions.length - 1]
    const stats = {
      technicalAccuracy: latest.performance?.technicalAccuracy || 0,
      communication: latest.performance?.communication || 0,
      confidence: latest.performance?.confidence || 0,
    }

    res.json({ success: true, data: { trend, stats } })
  } catch (err) {
    next(err)
  }
}

export async function getInsights(req, res, next) {
  try {
    const userId = req.user._id

    const sessions = await InterviewSession.find({ userId, status: 'completed' })
      .sort({ endedAt: -1 })
      .limit(1)
      .select('aiFeedback performance')

    if (sessions.length === 0) {
      return res.json({
        success: true,
        data: {
          strengths: ['Clear articulation of concepts', 'Demonstrated understanding of core principles', 'Engaging and professional tone'],
          weaknesses: ['Lack of concrete examples', 'Hesitation during technical questions', 'Need for faster response times'],
          suggestions: [{ question: 'Describe a complex problem you solved.', answer: 'Focus on the STAR method, clearly outlining the Situation, Task, Action, and Result. Be specific about your role and the positive outcome.' }],
        },
      })
    }

    const session = sessions[0]
    res.json({
      success: true,
      data: {
        strengths: session.aiFeedback?.strengths || [],
        weaknesses: session.aiFeedback?.weaknesses || [],
        suggestions: session.aiFeedback?.suggestions?.map((s) => ({ answer: s })) || [],
      },
    })
  } catch (err) {
    next(err)
  }
}

function getDefaultStats() {
  return { technicalAccuracy: 85, communication: 92, confidence: 78 }
}
