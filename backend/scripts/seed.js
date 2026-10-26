import { connectDatabase, disconnectDatabase } from '../src/config/database.js';
import { Item } from '../src/models/Item.js';
import { loadSeedData } from '../src/services/itemService.js';
import { env } from '../src/config/env.js';

export async function seedDatabase(uri = env.MONGODB_URI) {
  console.log(`[Seed] Connecting to MongoDB: ${uri}`);
  await connectDatabase(uri);

  console.log('[Seed] Ensuring collection indexes...');
  await Item.syncIndexes();

  const seedItems = loadSeedData();
  console.log(`[Seed] Seeding ${seedItems.length} campus mock records (idempotent upsert)...`);

  let upsertedCount = 0;
  for (const item of seedItems) {
    await Item.findOneAndUpdate(
      { id: item.id },
      { $set: item },
      { upsert: true, new: true, runValidators: true }
    );
    upsertedCount++;
  }

  const totalInDb = await Item.countDocuments();
  console.log(`[Seed] Successfully processed ${upsertedCount} records. Total items in MongoDB: ${totalInDb}`);

  return { upsertedCount, totalInDb };
}

// Direct execution
if (process.argv[1] && process.argv[1].endsWith('seed.js')) {
  seedDatabase()
    .then(async () => {
      console.log('[Seed] Seeding completed successfully.');
      await disconnectDatabase();
      process.exit(0);
    })
    .catch(async (err) => {
      console.error('[Seed] Seeding failed:', err);
      try {
        await disconnectDatabase();
      } catch (e) {
        // ignore
      }
      process.exit(1);
    });
}
