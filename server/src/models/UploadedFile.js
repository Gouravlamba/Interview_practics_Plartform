import mongoose from 'mongoose'

const uploadedFileSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    originalName: { type: String, required: true },
    storedName: { type: String, required: true },
    mimetype: { type: String, required: true },
    size: { type: Number, required: true },
    path: { type: String, required: true },
    purpose: { type: String, enum: ['resume', 'other'], default: 'resume' },
  },
  { timestamps: true }
)

const UploadedFile = mongoose.model('UploadedFile', uploadedFileSchema)
export default UploadedFile
