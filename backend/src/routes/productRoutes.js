import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { body } from 'express-validator';
import { createProduct, updateProduct, getProducts, getProductBySlug, deleteProduct } from '../controllers/productController.js';
import { requireAuth } from '../middleware/auth.js';

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(process.cwd(), 'backend', 'uploads')),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

const router = Router();

router.get('/', getProducts);
router.get('/slug/:slug', getProductBySlug);

router.post('/', requireAuth, upload.array('images', 8), [body('name').notEmpty(), body('price').isFloat({ min: 0 })], createProduct);
router.put('/:id', requireAuth, updateProduct);
router.delete('/:id', requireAuth, deleteProduct);

export default router;

