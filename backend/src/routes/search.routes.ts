import { Router } from 'express';
import * as searchController from '../controllers/search.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.get('/', authenticate, searchController.searchAll);
router.get('/autocomplete', searchController.getAutocomplete);
router.get('/recent', authenticate, searchController.getRecentSearches);
router.get('/nearby', searchController.getNearby);

export default router;
