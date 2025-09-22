import nodemailer from 'nodemailer';
import { env } from '../config/env.js';

let transporter;

function getTransporter() {
	if (!transporter) {
		transporter = nodemailer.createTransport({
			host: env.SMTP_HOST,
			port: env.SMTP_PORT,
			secure: env.SMTP_PORT === 465,
			auth: env.SMTP_USER
				? { user: env.SMTP_USER, pass: env.SMTP_PASS }
				: undefined,
		});
	}
	return transporter;
}

export async function sendEmail({ to, subject, html }) {
	if (!to) return;
	const tx = getTransporter();
	await tx.sendMail({ from: env.SMTP_FROM, to, subject, html });
}

