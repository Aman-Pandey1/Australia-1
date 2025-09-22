import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import {
	dashboardSummary,
	// users
	listUsers,
	setUserRole,
	// listings
	listListings,
	setListingStatus,
	deleteListing,
	// moderation
	listReviews,
	setReviewStatus,
	listComments,
	setCommentStatus,
	// reports
	listReports,
	setReportStatus,
	// subscriptions
	listSubscriptions,
	createSubscription,
	cancelSubscription,
	// ads
	listAds,
	setAdStatus,
	// posts/pages
	listPosts,
	upsertPost,
	deletePost,
	listPages,
	upsertPage,
	deletePage,
	// settings
	getSettings,
	setSettings,
} from '../controllers/adminController.js';

const router = Router();

// Guard all admin routes
router.use(authenticate, authorize('admin'));

router.get('/summary', dashboardSummary);

// Users
router.get('/users', listUsers);
router.patch('/users/:id/role', setUserRole);

// Listings
router.get('/listings', listListings);
router.patch('/listings/:id/status', setListingStatus);
router.delete('/listings/:id', deleteListing);

// Moderation
router.get('/reviews', listReviews);
router.patch('/reviews/:id/status', setReviewStatus);
router.get('/comments', listComments);
router.patch('/comments/:id/status', setCommentStatus);

// Reports
router.get('/reports', listReports);
router.patch('/reports/:id/status', setReportStatus);

// Subscriptions
router.get('/subscriptions', listSubscriptions);
router.post('/subscriptions', createSubscription);
router.patch('/subscriptions/:id/cancel', cancelSubscription);

// Ads
router.get('/ads', listAds);
router.patch('/ads/:id/status', setAdStatus);

// Posts
router.get('/posts', listPosts);
router.post('/posts', upsertPost);
router.put('/posts/:id', upsertPost);
router.delete('/posts/:id', deletePost);

// Pages
router.get('/pages', listPages);
router.post('/pages', upsertPage);
router.put('/pages/:id', upsertPage);
router.delete('/pages/:id', deletePage);

// Settings
router.get('/settings', getSettings);
router.put('/settings', setSettings);

export default router;

