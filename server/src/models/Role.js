import mongoose from 'mongoose'

const roleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true, trim: true },
    description: { type: String, required: true },
    icon: { type: String, default: 'Briefcase' },
    isDefault: { type: Boolean, default: false },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
)

const Role = mongoose.model('Role', roleSchema)
export default Role
