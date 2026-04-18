import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware";
import {
  validateRequest,
  validateQuery,
} from "../middleware/validate.middleware";
import {
  createProjectSchema,
  updateProjectSchema,
  requestJoinSchema,
  browseQuerySchema,
} from "../validations/team.validation";
import {
  getMatches,
  createProject,
  getProject,
  updateProject,
  deleteProject,
  requestToJoin,
  acceptRequest,
  declineRequest,
  getMyProjects,
  browseProjects,
  getIncomingRequests,
} from "../controllers/team.controller";

const router = Router();

// All team routes require authentication
router.use(requireAuth);

// ---- Matching Engine ----
router.get("/matches", getMatches);

// ---- My Projects ----
router.get("/my-projects", getMyProjects);

// ---- Browse Open Projects ----
router.get("/browse", validateQuery(browseQuerySchema), browseProjects);
router.get("/requests", getIncomingRequests);

// ---- Project CRUD ----
router.post("/projects", validateRequest(createProjectSchema), createProject);
router.get("/projects/:id", getProject);
router.put(
  "/projects/:id",
  validateRequest(updateProjectSchema),
  updateProject,
);
router.delete("/projects/:id", deleteProject);

// ---- Join Requests ----
router.post(
  "/projects/:id/request",
  validateRequest(requestJoinSchema),
  requestToJoin,
);
router.put("/requests/:id/accept", acceptRequest);
router.put("/requests/:id/decline", declineRequest);

export default router;
