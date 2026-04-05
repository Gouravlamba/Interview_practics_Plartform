import mongoose from 'mongoose'

const messageSchema = new mongoose.Schema({
  sender: { type: String, enum: ['user', 'ai'], required: true },
  text: { type: String, required: true },
  time: { type: String },
  timestamp: { type: Date, default: Date.now },
})

const performanceSchema = new mongoose.Schema({
  technicalAccuracy: { type: Number, default: 0 },
  communication: { type: Number, default: 0 },
  confidence: { type: Number, default: 0 },
  coding: { type: Number, default: 0 },
  problemSolving: { type: Number, default: 0 },
  systemDesign: { type: Number, default: 0 },
  leadership: { type: Number, default: 0 },
  overallScore: { type: Number, default: 0 },
})

const sessionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    roleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Role' },
    persona: { type: String, default: 'Senior Tech Lead' },
    jobDescription: { type: String, default: '' },
    resumeFileId: { type: mongoose.Schema.Types.ObjectId, ref: 'UploadedFile' },
    status: {
      type: String,
      enum: ['setup', 'active', 'paused', 'completed', 'abandoned'],
      default: 'setup',
    },
    difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
    durationSeconds: { type: Number, default: 0 },
    messages: [messageSchema],
    code: { type: String, default: '' },
    codeLanguage: { type: String, default: 'python' },
    performance: { type: performanceSchema, default: () => ({}) },
    aiFeedback: {
      strengths: [{ type: String }],
      weaknesses: [{ type: String }],
      suggestions: [{ type: String }],
    },
    roomId: { type: String, index: true },
    endedAt: { type: Date },
  },
  { timestamps: true }
)

const InterviewSession = mongoose.model('InterviewSession', sessionSchema)
export default InterviewSession
