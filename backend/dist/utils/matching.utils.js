"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.invalidateMatchCache = exports.setCachedMatches = exports.getCachedMatches = exports.computeMatchScore = exports.computeCollaborationScore = exports.computeInterestScore = exports.computeSkillScore = exports.jaccardSimilarity = exports.cosineSimilarity = exports.MATCH_WEIGHTS = void 0;
const redis_1 = require("../config/redis");
/** ----------------------------------------------------------------
 *  WEIGHTS — Adjustable matching factors
 * ---------------------------------------------------------------- */
exports.MATCH_WEIGHTS = {
    skillOverlap: 0.50, // 50% — most important factor for project work
    interestAlignment: 0.25, // 25% — shared interests for cultural fit
    collaborationHistory: 0.15, // 15% — past successful team-ups
    availabilityBonus: 0.10, // 10% — currently open for new projects
};
/** ----------------------------------------------------------------
 *  COSINE SIMILARITY
 *  Measures the angle between two numeric vectors.
 *  Returns a value between 0 (no similarity) and 1 (identical).
 * ---------------------------------------------------------------- */
const cosineSimilarity = (a, b) => {
    if (a.length !== b.length || a.length === 0)
        return 0;
    const dot = a.reduce((acc, val, i) => acc + val * b[i], 0);
    const magA = Math.sqrt(a.reduce((acc, val) => acc + val * val, 0));
    const magB = Math.sqrt(b.reduce((acc, val) => acc + val * val, 0));
    if (magA === 0 || magB === 0)
        return 0;
    return dot / (magA * magB);
};
exports.cosineSimilarity = cosineSimilarity;
/** ----------------------------------------------------------------
 *  JACCARD SIMILARITY (fast local fallback for skill ID overlap)
 *  Now the primary matching logic since OpenAI is removed.
 * ---------------------------------------------------------------- */
const jaccardSimilarity = (setA, setB) => {
    if (setA.length === 0 && setB.length === 0)
        return 0;
    const a = new Set(setA);
    const b = new Set(setB);
    const intersection = [...a].filter(x => b.has(x)).length;
    const union = new Set([...a, ...b]).size;
    return union === 0 ? 0 : intersection / union;
};
exports.jaccardSimilarity = jaccardSimilarity;
/** ----------------------------------------------------------------
 *  SKILL SCORE
 *  Uses Jaccard (fast, free, exact keyword matching).
 * ---------------------------------------------------------------- */
const computeSkillScore = async (mySkillNames, theirSkillNames) => {
    if (mySkillNames.length === 0 || theirSkillNames.length === 0)
        return 0;
    return (0, exports.jaccardSimilarity)(mySkillNames, theirSkillNames);
};
exports.computeSkillScore = computeSkillScore;
/** ----------------------------------------------------------------
 *  INTEREST SCORE — Jaccard on interest strings (always local)
 * ---------------------------------------------------------------- */
const computeInterestScore = (myInterests, theirInterests) => {
    return (0, exports.jaccardSimilarity)(myInterests.map(i => i.toLowerCase()), theirInterests.map(i => i.toLowerCase()));
};
exports.computeInterestScore = computeInterestScore;
/** ----------------------------------------------------------------
 *  COLLABORATION HISTORY SCORE
 *  Bonus if the two users have been on successful teams together.
 *  Returns 0 (never worked together) to 1 (multiple successes).
 * ---------------------------------------------------------------- */
const computeCollaborationScore = (myCompletedProjectMemberIds, theirUserId) => {
    let sharedTeams = 0;
    for (const memberList of myCompletedProjectMemberIds) {
        if (memberList.includes(theirUserId))
            sharedTeams++;
    }
    // Logarithmic growth: 1 team = 0.5, 3 teams = ~0.79, 10 teams = 1.0 (capped)
    return Math.min(1, sharedTeams > 0 ? Math.log(sharedTeams + 1) / Math.log(11) : 0);
};
exports.computeCollaborationScore = computeCollaborationScore;
const computeMatchScore = (factors) => {
    const raw = factors.skillScore * exports.MATCH_WEIGHTS.skillOverlap +
        factors.interestScore * exports.MATCH_WEIGHTS.interestAlignment +
        factors.collaborationScore * exports.MATCH_WEIGHTS.collaborationHistory +
        (factors.isAvailable ? exports.MATCH_WEIGHTS.availabilityBonus : 0);
    return Math.round(raw * 100); // 0–100 integer
};
exports.computeMatchScore = computeMatchScore;
/** ----------------------------------------------------------------
 *  CACHE HELPERS for full match result sets
 * ---------------------------------------------------------------- */
const MATCH_CACHE_TTL = 60 * 60; // 1 hour
const getCachedMatches = async (userId) => {
    const cached = await redis_1.redisClient.get(`matches:${userId}`);
    return cached ? JSON.parse(cached) : null;
};
exports.getCachedMatches = getCachedMatches;
const setCachedMatches = async (userId, matches) => {
    await redis_1.redisClient.setEx(`matches:${userId}`, MATCH_CACHE_TTL, JSON.stringify(matches));
};
exports.setCachedMatches = setCachedMatches;
const invalidateMatchCache = async (userId) => {
    await redis_1.redisClient.del(`matches:${userId}`);
};
exports.invalidateMatchCache = invalidateMatchCache;
