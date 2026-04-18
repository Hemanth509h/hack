import { redisClient } from '../config/redis';

/** ----------------------------------------------------------------
 *  WEIGHTS — Adjustable matching factors
 * ---------------------------------------------------------------- */
export const MATCH_WEIGHTS = {
  skillOverlap: 0.50,     // 50% — most important factor for project work
  interestAlignment: 0.25, // 25% — shared interests for cultural fit
  collaborationHistory: 0.15, // 15% — past successful team-ups
  availabilityBonus: 0.10, // 10% — currently open for new projects
};

/** ----------------------------------------------------------------
 *  COSINE SIMILARITY
 *  Measures the angle between two numeric vectors.
 *  Returns a value between 0 (no similarity) and 1 (identical).
 * ---------------------------------------------------------------- */
export const cosineSimilarity = (a: number[], b: number[]) => {
  if (a.length !== b.length || a.length === 0) return 0;

  const dot = a.reduce((acc, val, i) => acc + val * b[i], 0);
  const magA = Math.sqrt(a.reduce((acc, val) => acc + val * val, 0));
  const magB = Math.sqrt(b.reduce((acc, val) => acc + val * val, 0));

  if (magA === 0 || magB === 0) return 0;
  return dot / (magA * magB);
};

/** ----------------------------------------------------------------
 *  JACCARD SIMILARITY (fast local fallback for skill ID overlap)
 *  Now the primary matching logic since OpenAI is removed.
 * ---------------------------------------------------------------- */
export const jaccardSimilarity = (setA: string[], setB: string[]) => {
  if (setA.length === 0 && setB.length === 0) return 0;
  const a = new Set(setA);
  const b = new Set(setB);
  const intersection = [...a].filter(x => b.has(x)).length;
  const union = new Set([...a, ...b]).size;
  return union === 0 ? 0 : intersection / union;
};

/** ----------------------------------------------------------------
 *  SKILL SCORE
 *  Uses Jaccard (fast, free, exact keyword matching).
 * ---------------------------------------------------------------- */
export const computeSkillScore = async (
  mySkillNames: string[],
  theirSkillNames: string[]
) => {
  if (mySkillNames.length === 0 || theirSkillNames.length === 0) return 0;
  return jaccardSimilarity(mySkillNames, theirSkillNames);
};

/** ----------------------------------------------------------------
 *  INTEREST SCORE — Jaccard on interest strings (always local)
 * ---------------------------------------------------------------- */
export const computeInterestScore = (myInterests: string[], theirInterests: string[]) => {
  return jaccardSimilarity(
    myInterests.map(i => i.toLowerCase()),
    theirInterests.map(i => i.toLowerCase())
  );
};

/** ----------------------------------------------------------------
 *  COLLABORATION HISTORY SCORE
 *  Bonus if the two users have been on successful teams together.
 *  Returns 0 (never worked together) to 1 (multiple successes).
 * ---------------------------------------------------------------- */
export const computeCollaborationScore = (
  myCompletedProjectMemberIds: string[][],
  theirUserId
) => {
  let sharedTeams = 0;
  for (const memberList of myCompletedProjectMemberIds) {
    if (memberList.includes(theirUserId)) sharedTeams++;
  }
  // Logarithmic growth: 1 team = 0.5, 3 teams = ~0.79, 10 teams = 1.0 (capped)
  return Math.min(1, sharedTeams > 0 ? Math.log(sharedTeams + 1) / Math.log(11) : 0);
};

/** ----------------------------------------------------------------
 *  FINAL WEIGHTED SCORE
 *  Returns a 0-100 compatibility percentage.
 * ---------------------------------------------------------------- */
export 

export const computeMatchScore = (factors) => {
  const raw =
    factors.skillScore * MATCH_WEIGHTS.skillOverlap +
    factors.interestScore * MATCH_WEIGHTS.interestAlignment +
    factors.collaborationScore * MATCH_WEIGHTS.collaborationHistory +
    (factors.isAvailable ? MATCH_WEIGHTS.availabilityBonus : 0);

  return Math.round(raw * 100); // 0–100 integer
};

/** ----------------------------------------------------------------
 *  CACHE HELPERS for full match result sets
 * ---------------------------------------------------------------- */
const MATCH_CACHE_TTL = 60 * 60; // 1 hour

export const getCachedMatches = async (userId) => {
  const cached = await redisClient.get(`matches:${userId}`);
  return cached ? JSON.parse(cached) : null;
};

export const setCachedMatches = async (userId, matches: any[]) => {
  await redisClient.setEx(`matches:${userId}`, MATCH_CACHE_TTL, JSON.stringify(matches));
};

export const invalidateMatchCache = async (userId) => {
  await redisClient.del(`matches:${userId}`);
};
