import dotenv from 'dotenv';
dotenv.config();

import { connectDB, disconnectDB } from '../config/db.js';
import { seedDatabase } from './seedData.js';

const run = async () => {
  try {
    await connectDB();
    const result = await seedDatabase();
    console.log(`🎉 Database successfully seeded with ${result.invoicesCount} invoices.`);
    await disconnectDB();
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
};

run();
