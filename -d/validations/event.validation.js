import Joi from "joi";

export const createEventSchema = Joi.object({
  title: Joi.string().required().trim().min(5).max(100),
  description: Joi.string().required().trim().min(20),
  category: Joi.string()
    .required()
    .valid(
      "Hackathon",
      "Workshop",
      "Cultural",
      "Sports",
      "Career",
      "Social",
      "Other",
    ),
  club: Joi.string().hex().length(24).optional(),
  location: Joi.string().hex().length(24).optional(),
  locationDetails: Joi.string().optional().allow(""),
  date: Joi.date().iso().greater("now").required(),
  durationMinutes: Joi.number().integer().min(15).max(1440).default(60),
  capacity: Joi.number().integer().min(1).optional(),
  coverImage: Joi.string().uri().optional(),
  tags: Joi.array().items(Joi.string().trim().lowercase()).max(10).default([]),
  targetAudience: Joi.object({
    majors: Joi.array().items(Joi.string()).default([]),
    years: Joi.array().items(Joi.number().integer()).default([]),
  }).default({ majors: [], years: [] }),
  status: Joi.string().valid("draft", "published").default("published"),
  organizerId: Joi.string().required(),
});

export const updateEventSchema = Joi.object({
  title: Joi.string().trim().min(5).max(100),
  description: Joi.string().trim().min(20),
  category: Joi.string().valid(
    "Hackathon",
    "Workshop",
    "Cultural",
    "Sports",
    "Career",
    "Social",
    "Other",
  ),
  locationDetails: Joi.string().allow(""),
  date: Joi.date().iso(),
  durationMinutes: Joi.number().integer().min(15).max(1440),
  capacity: Joi.number().integer().min(1),
  coverImage: Joi.string().uri(),
  tags: Joi.array().items(Joi.string().trim().lowercase()).max(10),
  status: Joi.string().valid("draft", "published", "cancelled"),
});

export const eventQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  search: Joi.string().trim().allow(""),
  category: Joi.string().trim(),
  startDate: Joi.date().iso(),
  endDate: Joi.date().iso().greater(Joi.ref("startDate")),
  club: Joi.string().hex().length(24),
  sortBy: Joi.string().valid("date", "popularity", "newest").default("date"),
});
