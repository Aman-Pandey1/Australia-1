import dotenv from 'dotenv';
import dayjs from 'dayjs';
import { connectDatabase } from '../config/db.js';
import slugify from 'slugify';
import { User } from '../models/User.js';
import { Listing } from '../models/Listing.js';

dotenv.config();

const SAMPLE_PHOTOS = [
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2',
    'https://images.unsplash.com/photo-1520975930461-d2e3b2b1e2e2',
    'https://images.unsplash.com/photo-1524504388940-b1c1722653e1',
    'https://images.unsplash.com/photo-1520975614850-1a4ddc1f14d1',
];

const CITIES = ['Sydney','Melbourne','Brisbane','Perth','Adelaide','Canberra'];
const CATEGORIES = ['Escort','Massage','Agency','Independent','GFE','BDSM'];
const GENDERS = ['female','male','trans'];

function pick(arr, n = 1) {
    const copy = [...arr];
    const result = [];
    while (n-- > 0 && copy.length) {
        const idx = Math.floor(Math.random() * copy.length);
        result.push(copy.splice(idx, 1)[0]);
    }
    return result;
}

function randomPhotos() {
    const count = 1 + Math.floor(Math.random() * 3);
    return pick(SAMPLE_PHOTOS, count);
}

async function ensureOwner() {
    const email = process.env.SEED_OWNER_EMAIL || 'owner@example.com';
    let user = await User.findOne({ email });
    if (!user) {
        const passwordHash = await User.hashPassword(process.env.SEED_OWNER_PASSWORD || 'Owner@123456');
        user = await User.create({ email, passwordHash, name: 'Seed Owner', role: 'user' });
    }
    return user;
}

function premiumForIndex(i) {
    if (i % 7 === 0) return { level: 'vip', startsAt: new Date(), expiresAt: dayjs().add(60, 'day').toDate(), showOnHomepage: true };
    if (i % 3 === 0) return { level: 'premium', startsAt: new Date(), expiresAt: dayjs().add(30, 'day').toDate() };
    if (i % 2 === 0) return { level: 'featured', startsAt: new Date(), expiresAt: dayjs().add(14, 'day').toDate() };
    return { level: 'none' };
}

async function main() {
    await connectDatabase();
    const owner = await ensureOwner();
    const total = parseInt(process.env.SEED_LISTINGS_COUNT || '48', 10);
    const items = [];
    for (let i = 1; i <= total; i++) {
        const city = CITIES[i % CITIES.length];
        const gender = GENDERS[i % GENDERS.length];
        const categories = pick(CATEGORIES, 2);
        const title = `${city} ${gender} model #${i}`;
        items.push({
            owner: owner._id,
            title,
            slug: `${slugify(title, { lower: true, strict: true })}-${i}`,
            description: 'High quality service. Discreet and professional. Call now.',
            photos: randomPhotos(),
            categories,
            contact: { city, country: 'Australia' },
            stats: { gender, age: 20 + (i % 10) },
            premium: premiumForIndex(i),
            status: 'approved',
            views: Math.floor(Math.random() * 5000),
            createdAt: dayjs().subtract(Math.floor(Math.random() * 30), 'day').toDate(),
            updatedAt: new Date(),
        });
    }
    await Listing.insertMany(items);
    // eslint-disable-next-line no-console
    console.log(`Seeded ${items.length} listings.`);
    process.exit(0);
}

main().catch((err) => {
    // eslint-disable-next-line no-console
    console.error(err);
    process.exit(1);
});

