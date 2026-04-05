export const errorHandler = (err, req, res, next) => {
  console.error(`[Error] ${err.message}`, err.stack)

  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message)
    return res.status(400).json({ success: false, message: messages.join(', ') })
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field'
    return res.status(409).json({
      success: false,
      message: `${field} already exists`,
    })
  }

  if (err.name === 'CastError') {
    return res.status(400).json({ success: false, message: 'Invalid ID format' })
  }

  const status = err.statusCode || err.status || 500
  const message = err.message || 'Internal Server Error'

  res.status(status).json({ success: false, message })
}

export const notFound = (req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.path} not found` })
}

export class AppError extends Error {
  constructor(message, statusCode = 400) {
    super(message)
    this.statusCode = statusCode
    this.name = 'AppError'
  }
}
