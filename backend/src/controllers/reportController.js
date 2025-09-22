import { validationResult } from 'express-validator';
import { Report } from '../models/Report.js';

export async function createReport(req, res) {
	const errors = validationResult(req);
	if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
	const { listing, reason } = req.body;
	const report = await Report.create({ listing, reason, reporter: req.user.id });
	return res.status(201).json({ report });
}

export async function myReports(req, res) {
	const items = await Report.find({ reporter: req.user.id }).sort({ createdAt: -1 });
	return res.json({ reports: items });
}

