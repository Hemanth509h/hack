import { Router } from 'express';
import { searchLocations } from '../controllers/location.controller.js';
const router = Router();
router.get('/search', searchLocations);
export default router;
