const Notice = require('../models/Notice')

const getNotices = async (req, res) => {
  try {
    const { category, isPublic } = req.query
    const filter = {}
    if (category) filter.category = category
    if (isPublic !== undefined) filter.isPublic = isPublic === 'true'
    const notices = await Notice.find(filter).populate('postedBy', 'name role').sort({ createdAt: -1 })
    return res.json(notices)
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

const getNotice = async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id).populate('postedBy', 'name role')
    if (!notice) return res.status(404).json({ message: 'Notice not found' })
    return res.json(notice)
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

const createNotice = async (req, res) => {
  try {
    const { title, content, category, isPublic } = req.body
    if (!title?.trim() || !content?.trim()) {
      return res.status(400).json({ message: 'Title and content are required' })
    }
    const notice = await Notice.create({
      title: title.trim(), content: content.trim(),
      category: category || 'general',
      isPublic: isPublic !== undefined ? isPublic : true,
      postedBy: req.user._id,
    })
    return res.status(201).json({ message: 'Notice created', notice })
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

const updateNotice = async (req, res) => {
  try {
    const notice = await Notice.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!notice) return res.status(404).json({ message: 'Notice not found' })
    return res.json({ message: 'Notice updated', notice })
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

const deleteNotice = async (req, res) => {
  try {
    await Notice.findByIdAndDelete(req.params.id)
    return res.json({ message: 'Notice deleted' })
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

module.exports = { getNotices, getNotice, createNotice, updateNotice, deleteNotice }