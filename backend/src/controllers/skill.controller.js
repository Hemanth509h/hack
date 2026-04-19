import { Skill } from '../models/Skill.js';
/**
 * @desc    List all skills with pagination
 * @route   GET /api/v1/skills
 */
export const getAllSkills = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 50;
        const skills = await Skill.find()
            .sort({ name: 1 })
            .skip((page - 1) * limit)
            .limit(limit);
        const total = await Skill.countDocuments();
        res.json({ skills, pagination: { total, page, pages: Math.ceil(total / limit) } });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch skills' });
    }
};
/**
 * @desc    Autocomplete search on skills
 * @route   GET /api/v1/skills/search?q=react
 */
export const searchSkills = async (req, res) => {
    try {
        const { q = '', limit = 10 } = req.query;
        if (!q || q.trim() === '') {
            // Return recent/popular skills when no query
            const skills = await Skill.find().sort({ name: 1 }).limit(parseInt(limit));
            return res.json({ skills });
        }
        // Use text index for fast autocomplete-style search
        const skills = await Skill.find({ $text: { $search: q } }, { score: { $meta: 'textScore' } })
            .sort({ score: { $meta: 'textScore' } })
            .limit(parseInt(limit));
        res.json({ skills });
    }
    catch (error) {
        res.status(500).json({ error: 'Skill search failed' });
    }
};
/**
 * @desc    Get distinct skill categories
 * @route   GET /api/v1/skills/categories
 */
export const getSkillCategories = async (req, res) => {
    try {
        const categories = await Skill.distinct('category');
        res.json({ categories: categories.sort() });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch categories' });
    }
};
/**
 * @desc    Create a new skill (admin or auto-create)
 * @route   POST /api/v1/skills
 */
export const createSkill = async (req, res) => {
    try {
        const { name, category, aliases } = req.body;
        const normalizedName = name.toLowerCase().trim();
        // Deduplication check - case-insensitive match
        const existing = await Skill.findOne({ name: normalizedName });
        if (existing) {
            return res.status(409).json({
                error: 'Skill already exists',
                skill: existing
            });
        }
        const skill = await Skill.create({
            name: normalizedName,
            category,
            aliases: aliases?.map((a) => a.toLowerCase().trim()) ?? []
        });
        res.status(201).json({ message: 'Skill created', skill });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to create skill', details: error.message });
    }
};
