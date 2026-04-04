import jwt from 'jsonwebtoken'
import { body } from 'express-validator'
import { config } from '../config/index.js'
import User from '../models/User.js'
import { AppError } from '../middleware/error.js'

function generateTokens(userId) {
  const accessToken = jwt.sign({ userId }, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  })
  const refreshToken = jwt.sign({ userId }, config.jwt.refreshSecret, {
    expiresIn: config.jwt.refreshExpiresIn,
  })
  return { accessToken, refreshToken }
}

export const registerValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
]

export const loginValidation = [
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
]

export async function register(req, res, next) {
  try {
    const { name, email, password } = req.body

    const existing = await User.findOne({ email })
    if (existing) throw new AppError('Email already registered', 409)

    const user = await User.create({ name, email, password })
    const { accessToken, refreshToken } = generateTokens(user._id)

    user.refreshToken = refreshToken
    await user.save({ validateBeforeSave: false })

    res.status(201).json({
      success: true,
      data: { user: user.toSafeObject(), accessToken, refreshToken },
    })
  } catch (err) {
    next(err)
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email }).select('+password +refreshToken')
    if (!user || !(await user.comparePassword(password))) {
      throw new AppError('Invalid email or password', 401)
    }

    if (!user.isActive) throw new AppError('Account is deactivated', 403)

    const { accessToken, refreshToken } = generateTokens(user._id)
    user.refreshToken = refreshToken
    await user.save({ validateBeforeSave: false })

    res.json({
      success: true,
      data: { user: user.toSafeObject(), accessToken, refreshToken },
    })
  } catch (err) {
    next(err)
  }
}

export async function refresh(req, res, next) {
  try {
    const { refreshToken } = req.body
    if (!refreshToken) throw new AppError('Refresh token required', 400)

    let decoded
    try {
      decoded = jwt.verify(refreshToken, config.jwt.refreshSecret)
    } catch {
      throw new AppError('Invalid refresh token', 401)
    }

    const user = await User.findById(decoded.userId).select('+refreshToken')
    if (!user || user.refreshToken !== refreshToken) {
      throw new AppError('Refresh token mismatch', 401)
    }

    const { accessToken, refreshToken: newRefresh } = generateTokens(user._id)
    user.refreshToken = newRefresh
    await user.save({ validateBeforeSave: false })

    res.json({ success: true, data: { accessToken, refreshToken: newRefresh } })
  } catch (err) {
    next(err)
  }
}

export async function logout(req, res, next) {
  try {
    const user = await User.findById(req.user._id).select('+refreshToken')
    if (user) {
      user.refreshToken = undefined
      await user.save({ validateBeforeSave: false })
    }
    res.json({ success: true, message: 'Logged out successfully' })
  } catch (err) {
    next(err)
  }
}

export async function getMe(req, res) {
  res.json({ success: true, data: req.user })
}
