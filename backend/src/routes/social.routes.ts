import { Router } from 'express';
import { 
  createPost, 
  getSocialFeed, 
  likePost, 
  addComment 
} from '../controllers/social.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

router.use(protect);

router.post('/', createPost);
router.get('/', getSocialFeed);
router.post('/:id/like', likePost);
router.post('/:id/comment', addComment);

export default router;
