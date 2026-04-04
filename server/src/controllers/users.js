import { body } from 'express-validator'
import User from '../models/User.js'
import { AppError } from '../middleware/error.js'

export const updateProfileValidation = [
  body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
  body('email').optional().isEmail().withMessage('Valid email required').normalizeEmail(),
]

export async function getProfile(req, res) {
  res.json({ success: true, data: req.user })
}

export async function updateProfile(req, res, next) {
  try {
    const { name, email, avatar } = req.body
    const update = {}
    if (name) update.name = name
    if (email) update.email = email
    if (avatar !== undefined) update.avatar = avatar

    if (email && email !== req.user.email) {
      const existing = await User.findOne({ email })
      if (existing) throw new AppError('Email already in use', 409)
    }

    const user = await User.findByIdAndUpdate(req.user._id, update, {
      new: true,
      runValidators: true,
    })
    res.json({ success: true, data: user })
  } catch (err) {
    next(err)
  }
}

export async function getAllUsers(req, res, next) {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1)
    const limit = Math.min(100, parseInt(req.query.limit) || 20)
    const skip = (page - 1) * limit

    const [users, total] = await Promise.all([
      User.find().skip(skip).limit(limit).sort({ createdAt: -1 }),
      User.countDocuments(),
    ])

    res.json({
      success: true,
      data: users,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    })
  } catch (err) {
    next(err)
  }
}
