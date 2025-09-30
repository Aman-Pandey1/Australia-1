const mongoose = require('mongoose');
const { connectToDatabase } = require('../config/db');
const User = require('../models/User');
const Listing = require('../models/Listing');
const Contact = require('../models/Contact');

async function run() {
  await connectToDatabase();

  const [user] = await User.find().limit(1);
  const owner = user || (await User.create({ email: 'owner@example.com', passwordHash: '$2a$10$yVwa2YQtcwTxvuNwYjT12u.2ewTgVTQyrT6kGOqJDg3k6mVhn3pOO', name: 'Provider', role: 'provider' }));

  const contact = await Contact.create({
    city: 'Vienna',
    country: 'Austria',
    phone: '+436608731219',
    apps: ['WhatsApp', 'Telegram'],
    website: ''
  });

  const existing = await Listing.findOne({ 'contact.city': 'Vienna', owner: owner._id });
  if (!existing) {
    await Listing.create({
      owner: owner._id,
      title: 'Elegant Companion in Vienna',
      description: 'Discreet and charming. Hotel & Home visits available.',
      contact: {
        city: 'Vienna',
        country: 'Austria',
        phone: '+436608731219',
        apps: ['WhatsApp', 'Telegram'],
        website: ''
      },
      profile: {
        gender: 'Female',
        sexualOrientation: 'Heterosexual',
        age: 28,
        location: 'Vienna',
        eyes: 'Brown',
        hair: 'Brown',
        breasts: 'Natural breasts',
        pubicHair: 'Shaved completely',
        outcall: 'Hotel & Home Visits',
        languages: ['English'],
        ethnicity: 'European (white)',
        nationality: 'Moldovian',
        heightCm: 165,
        weightKg: 47,
        smoking: 'I am not smoking',
        drinking: 'No',
        tattoos: 'No',
        piercings: 'No',
        meetingWith: 'Available for men',
        availableForCouples: true
      },
      status: 'approved',
      advertising: { homepageVip: true },
    });
  }

  // eslint-disable-next-line no-console
  console.log('Seed completed.');
  await mongoose.connection.close();
}

run().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});

