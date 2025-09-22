import { Router } from 'express';
import { publicPost, publicPosts, publicPage } from '../controllers/contentController.js';

const router = Router();

router.get('/posts', publicPosts);
router.get('/posts/:slug', publicPost);
router.get('/pages/:slug', publicPage);

export default router;

