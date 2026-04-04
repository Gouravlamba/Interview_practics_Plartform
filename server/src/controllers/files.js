import path from 'path'
import fs from 'fs'
import UploadedFile from '../models/UploadedFile.js'
import { AppError } from '../middleware/error.js'
import { config } from '../config/index.js'

export async function uploadFile(req, res, next) {
  try {
    if (!req.file) throw new AppError('No file provided', 400)

    const uploaded = await UploadedFile.create({
      userId: req.user._id,
      originalName: req.file.originalname,
      storedName: req.file.filename,
      mimetype: req.file.mimetype,
      size: req.file.size,
      path: req.file.path,
      purpose: req.body.purpose || 'resume',
    })

    res.status(201).json({
      success: true,
      data: {
        id: uploaded._id,
        originalName: uploaded.originalName,
        size: uploaded.size,
        mimetype: uploaded.mimetype,
        purpose: uploaded.purpose,
        createdAt: uploaded.createdAt,
      },
    })
  } catch (err) {
    next(err)
  }
}

export async function getUserFiles(req, res, next) {
  try {
    const files = await UploadedFile.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .select('-path -storedName')
    res.json({ success: true, data: files })
  } catch (err) {
    next(err)
  }
}

export async function deleteFile(req, res, next) {
  try {
    const file = await UploadedFile.findOne({ _id: req.params.id, userId: req.user._id })
    if (!file) throw new AppError('File not found', 404)

    const filePath = path.resolve(config.upload.dir, file.storedName)
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
    }

    await file.deleteOne()
    res.json({ success: true, message: 'File deleted' })
  } catch (err) {
    next(err)
  }
}
