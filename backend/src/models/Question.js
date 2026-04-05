import mongoose from 'mongoose'

const questionSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    category: {
      type: String,
      enum: ['technical', 'behavioral', 'system-design', 'product', 'general'],
      default: 'general',
    },
    difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
    tags: [{ type: String }],
    roleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Role' },
    sampleAnswer: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
)

const Question = mongoose.model('Question', questionSchema)
export default Question
