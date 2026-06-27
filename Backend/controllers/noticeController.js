const Notice = require('../models/Notice')

// @GET /api/notices
const getNotices = async (req, res) => {
  const { category, isPublic } = req.query
  const filter = {}
  if (category) filter.category = category
  if (isPublic !== undefined) filter.isPublic = isPublic === 'true'

  const notices = await Notice.find(filter)
    .populate('postedBy', 'name role')
    .sort({ createdAt: -1 })
  res.json(notices)
}

// @GET /api/notices/:id
const getNotice = async (req, res) => {
  const notice = await Notice.findById(req.params.id).populate('postedBy', 'name role')
  if (!notice) return res.status(404).json({ message: 'Notice not found' })
  res.json(notice)
}

// @POST /api/notices
const createNotice = async (req, res) => {
  const { title, content, category, isPublic } = req.body
  const notice = await Notice.create({
    title, content, category, isPublic, postedBy: req.user._id
  })
  res.status(201).json({ message: 'Notice created', notice })
}

// @PUT /api/notices/:id
const updateNotice = async (req, res) => {
  const notice = await Notice.findByIdAndUpdate(req.params.id, req.body, { new: true })
  if (!notice) return res.status(404).json({ message: 'Notice not found' })
  res.json({ message: 'Notice updated', notice })
}

// @DELETE /api/notices/:id
const deleteNotice = async (req, res) => {
  await Notice.findByIdAndDelete(req.params.id)
  res.json({ message: 'Notice deleted' })
}

module.exports = { getNotices, getNotice, createNotice, updateNotice, deleteNotice }