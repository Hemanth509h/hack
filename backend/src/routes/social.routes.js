import { Router } from 'express';
import { 
  createPost, 
  getSocialFeed, 
  likePost, 
  addComment 
} from '../controllers/social.controller';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

router.use(requireAuth);

router.post('/', createPost);
router.get('/', getSocialFeed);
router.post('/:id/like', likePost);
router.post('/:id/comment', addComment);

export default router;
