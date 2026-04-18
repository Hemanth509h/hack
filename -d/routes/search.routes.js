import { Router } from "express";
import * as searchController from "../controllers/search.controller";
import { requireAuth } from "../middleware/auth.middleware";

const router = Router();

router.get("/", requireAuth, searchController.searchAll);
router.get("/autocomplete", searchController.getAutocomplete);
router.get("/recent", requireAuth, searchController.getRecentSearches);
router.get("/nearby", searchController.getNearby);

export default router;
