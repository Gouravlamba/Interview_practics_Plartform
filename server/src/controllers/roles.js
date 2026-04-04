import { body } from 'express-validator'
import Role from '../models/Role.js'
import { AppError } from '../middleware/error.js'

export const roleValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
]

export async function getRoles(req, res, next) {
  try {
    const roles = await Role.find().sort({ isDefault: -1, title: 1 })
    res.json({ success: true, data: roles })
  } catch (err) {
    next(err)
  }
}

export async function createRole(req, res, next) {
  try {
    const { title, description, icon } = req.body
    const role = await Role.create({ title, description, icon, createdBy: req.user._id })
    res.status(201).json({ success: true, data: role })
  } catch (err) {
    next(err)
  }
}

export async function updateRole(req, res, next) {
  try {
    const role = await Role.findById(req.params.id)
    if (!role) throw new AppError('Role not found', 404)

    const { title, description, icon } = req.body
    if (title) role.title = title
    if (description) role.description = description
    if (icon) role.icon = icon

    await role.save()
    res.json({ success: true, data: role })
  } catch (err) {
    next(err)
  }
}

export async function deleteRole(req, res, next) {
  try {
    const role = await Role.findById(req.params.id)
    if (!role) throw new AppError('Role not found', 404)
    if (role.isDefault) throw new AppError('Cannot delete default roles', 400)
    await role.deleteOne()
    res.json({ success: true, message: 'Role deleted' })
  } catch (err) {
    next(err)
  }
}

export async function seedDefaultRoles() {
  const defaults = [
    { title: 'Senior Tech Lead', description: 'Focuses on technical depth, algorithms, and system design.', icon: 'Code2', isDefault: true },
    { title: 'HR Manager', description: 'Evaluates cultural fit, behavioral questions, and soft skills.', icon: 'Briefcase', isDefault: true },
    { title: 'Startup Founder', description: 'Tests adaptability, product sense, and rapid problem-solving.', icon: 'Rocket', isDefault: true },
  ]

  for (const r of defaults) {
    await Role.updateOne({ title: r.title }, { $setOnInsert: r }, { upsert: true })
  }
}
