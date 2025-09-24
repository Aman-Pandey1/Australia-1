import { Router } from 'express';
import { publicPost, publicPosts, publicPage, contactSubmit } from '../controllers/contentController.js';

const router = Router();

router.get('/posts', publicPosts);
router.get('/posts/:slug', publicPost);
router.get('/pages/:slug', publicPage);
router.post('/contact', contactSubmit);

export default router;

