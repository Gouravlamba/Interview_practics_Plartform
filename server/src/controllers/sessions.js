import { body } from 'express-validator'
import { v4 as uuidv4 } from 'uuid'
import InterviewSession from '../models/InterviewSession.js'
import { generateQuestions, generatePerformanceFeedback } from '../services/aiService.js'
import { AppError } from '../middleware/error.js'

export const sessionValidation = [
  body('persona').optional().trim(),
  body('jobDescription').optional().trim(),
  body('difficulty').optional().isIn(['easy', 'medium', 'hard']),
]

export async function createSession(req, res, next) {
  try {
    const { persona, jobDescription, resumeFileId, difficulty, roleId } = req.body

    const roomId = uuidv4()
    const session = await InterviewSession.create({
      userId: req.user._id,
      persona: persona || 'Senior Tech Lead',
      jobDescription: jobDescription || '',
      resumeFileId,
      difficulty: difficulty || 'medium',
      roleId,
      roomId,
      status: 'setup',
    })

    const { questions } = await generateQuestions({
      persona: session.persona,
      jobDescription: session.jobDescription,
      difficulty: session.difficulty,
    })

    res.status(201).json({
      success: true,
      data: { session, questions, roomId },
    })
  } catch (err) {
    next(err)
  }
}

export async function getSession(req, res, next) {
  try {
    const session = await InterviewSession.findOne({
      _id: req.params.id,
      userId: req.user._id,
    }).populate('roleId', 'title description')

    if (!session) throw new AppError('Session not found', 404)
    res.json({ success: true, data: session })
  } catch (err) {
    next(err)
  }
}

export async function getUserSessions(req, res, next) {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1)
    const limit = Math.min(50, parseInt(req.query.limit) || 10)
    const skip = (page - 1) * limit

    const filter = { userId: req.user._id }
    if (req.query.status) filter.status = req.query.status

    const [sessions, total] = await Promise.all([
      InterviewSession.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('-messages')
        .populate('roleId', 'title'),
      InterviewSession.countDocuments(filter),
    ])

    res.json({
      success: true,
      data: sessions,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    })
  } catch (err) {
    next(err)
  }
}

export async function updateSession(req, res, next) {
  try {
    const session = await InterviewSession.findOne({
      _id: req.params.id,
      userId: req.user._id,
    })
    if (!session) throw new AppError('Session not found', 404)

    const { status, code, codeLanguage } = req.body
    if (status) session.status = status
    if (code !== undefined) session.code = code
    if (codeLanguage) session.codeLanguage = codeLanguage

    if (status === 'completed') {
      session.endedAt = new Date()
      const feedback = await generatePerformanceFeedback(session.messages, session.code)
      if (feedback.feedback?.scores) {
        session.performance = feedback.feedback.scores
      }
      if (feedback.feedback?.strengths) {
        session.aiFeedback.strengths = feedback.feedback.strengths
        session.aiFeedback.weaknesses = feedback.feedback.weaknesses
        session.aiFeedback.suggestions = feedback.feedback.suggestions
      }
    }

    await session.save()
    res.json({ success: true, data: session })
  } catch (err) {
    next(err)
  }
}

export async function getUpcomingInterviews(req, res, next) {
  try {
    const sessions = await InterviewSession.find({
      userId: req.user._id,
      status: { $in: ['setup', 'active'] },
    })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('persona difficulty createdAt status roomId')

    res.json({ success: true, data: sessions })
  } catch (err) {
    next(err)
  }
}

export async function getPastRecordings(req, res, next) {
  try {
    const sessions = await InterviewSession.find({
      userId: req.user._id,
      status: 'completed',
    })
      .sort({ endedAt: -1 })
      .limit(10)
      .select('persona difficulty endedAt performance.overallScore')

    res.json({ success: true, data: sessions })
  } catch (err) {
    next(err)
  }
}
