import { body, query } from 'express-validator'
import Question from '../models/Question.js'
import { AppError } from '../middleware/error.js'

export const questionValidation = [
  body('text').trim().notEmpty().withMessage('Question text is required'),
  body('category')
    .optional()
    .isIn(['technical', 'behavioral', 'system-design', 'product', 'general']),
  body('difficulty').optional().isIn(['easy', 'medium', 'hard']),
]

export async function getQuestions(req, res, next) {
  try {
    const { category, difficulty, roleId, page = 1, limit = 20 } = req.query
    const filter = {}
    if (category) filter.category = category
    if (difficulty) filter.difficulty = difficulty
    if (roleId) filter.roleId = roleId

    const skip = (Math.max(1, parseInt(page)) - 1) * Math.min(100, parseInt(limit))
    const [questions, total] = await Promise.all([
      Question.find(filter).populate('roleId', 'title').skip(skip).limit(parseInt(limit)).sort({ createdAt: -1 }),
      Question.countDocuments(filter),
    ])

    res.json({ success: true, data: questions, pagination: { page: parseInt(page), total } })
  } catch (err) {
    next(err)
  }
}

export async function createQuestion(req, res, next) {
  try {
    const { text, category, difficulty, tags, roleId, sampleAnswer } = req.body
    const question = await Question.create({
      text, category, difficulty, tags, roleId, sampleAnswer,
      createdBy: req.user._id,
    })
    res.status(201).json({ success: true, data: question })
  } catch (err) {
    next(err)
  }
}

export async function updateQuestion(req, res, next) {
  try {
    const question = await Question.findById(req.params.id)
    if (!question) throw new AppError('Question not found', 404)
    Object.assign(question, req.body)
    await question.save()
    res.json({ success: true, data: question })
  } catch (err) {
    next(err)
  }
}

export async function deleteQuestion(req, res, next) {
  try {
    const question = await Question.findByIdAndDelete(req.params.id)
    if (!question) throw new AppError('Question not found', 404)
    res.json({ success: true, message: 'Question deleted' })
  } catch (err) {
    next(err)
  }
}
