import { Request, Response } from 'express';
import { Skill } from '../models/Skill';
import { AuthRequest } from '../middleware/auth.middleware';

/**
 * @desc    List all skills with pagination
 * @route   GET /api/v1/skills
 */
export const getAllSkills = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;

    const skills = await Skill.find()
      .sort({ name: 1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Skill.countDocuments();

    res.json({ skills, pagination: { total, page, pages: Math.ceil(total / limit) } });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch skills' });
  }
};

/**
 * @desc    Autocomplete search on skills
 * @route   GET /api/v1/skills/search?q=react
 */
export const searchSkills = async (req: Request, res: Response) => {
  try {
    const { q = '', limit = 10 } = req.query;

    if (!q || (q as string).trim() === '') {
      // Return recent/popular skills when no query
      const skills = await Skill.find().sort({ name: 1 }).limit(parseInt(limit as string));
      return res.json({ skills });
    }

    // Use text index for fast autocomplete-style search
    const skills = await Skill.find(
      { $text: { $search: q as string } },
      { score: { $meta: 'textScore' } }
    )
      .sort({ score: { $meta: 'textScore' } })
      .limit(parseInt(limit as string));

    res.json({ skills });
  } catch (error) {
    res.status(500).json({ error: 'Skill search failed' });
  }
};

/**
 * @desc    Get distinct skill categories
 * @route   GET /api/v1/skills/categories
 */
export const getSkillCategories = async (req: Request, res: Response) => {
  try {
    const categories = await Skill.distinct('category');
    res.json({ categories: categories.sort() });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
};

/**
 * @desc    Create a new skill (admin or auto-create)
 * @route   POST /api/v1/skills
 */
export const createSkill = async (req: AuthRequest, res: Response) => {
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
      aliases: aliases?.map((a: string) => a.toLowerCase().trim()) ?? []
    });

    res.status(201).json({ message: 'Skill created', skill });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to create skill', details: error.message });
  }
};
