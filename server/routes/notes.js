const express = require('express');
const Note = require('../models/Note');
const auth = require('../middleware/auth');
const { validate, noteSchema } = require('../utils/validattors');
const router = express.Router();

/**
 * @route   POST /notes
 * @desc    Create a new note
 * @access  Private
 */
router.post('/', auth, async (req, res) => {
  try {
    // ✅ Validate request body
    const { valid, errors, value } = validate(noteSchema, req.body);
    if (!valid) return res.status(400).json({ message: errors });

    const data = { ...value, user: req.user._id };
    const note = await Note.create(data);
    res.status(201).json(note);
  } catch (error) {
    console.error('Create Note Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   GET /notes
 * @desc    Get all notes for current user (with search/filter)
 * @access  Private
 */
router.get('/', auth, async (req, res) => {
  try {
    const { q, tag } = req.query;
    const filter = { user: req.user._id };

    if (q) filter.$or = [
      { title: new RegExp(q, 'i') },
      { content: new RegExp(q, 'i') },
    ];
    if (tag) filter.tags = tag;

    const notes = await Note.find(filter).sort({ updatedAt: -1 });
    res.json(notes);
  } catch (error) {
    console.error('Fetch Notes Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   PUT /notes/:id
 * @desc    Update a note by ID
 * @access  Private
 */
router.put('/:id', auth, async (req, res) => {
  try {
    // ✅ Validate data (optional — only if title/content provided)
    const { valid, errors, value } = validate(noteSchema, req.body);
    if (!valid) return res.status(400).json({ message: errors });

    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      value,
      { new: true }
    );

    if (!note) return res.status(404).json({ message: 'Note not found' });
    res.json(note);
  } catch (error) {
    console.error('Update Note Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   DELETE /notes/:id
 * @desc    Delete a note by ID
 * @access  Private
 */
router.delete('/:id', auth, async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!note) return res.status(404).json({ message: 'Note not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    console.error('Delete Note Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
