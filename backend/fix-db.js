const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('Error: MONGODB_URI is not defined in .env');
    process.exit(1);
}

async function fixDatabase() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        const collection = mongoose.connection.collection('properties');
        
        console.log('Fetching indexes...');
        const indexes = await collection.indexes();
        console.log('Current indexes:', indexes);

        // Look for propertyId_1
        const hasPropertyIdIndex = indexes.some(idx => idx.name === 'propertyId_1');
        
        if (hasPropertyIdIndex) {
            console.log('Found propertyId_1 index. Dropping it...');
            await collection.dropIndex('propertyId_1');
            console.log('Successfully dropped propertyId_1 index!');
        } else {
            console.log('Index propertyId_1 not found. Nothing to drop.');
        }

        console.log('Database fix complete.');
        process.exit(0);
    } catch (err) {
        console.error('Error fixing database:', err);
        process.exit(1);
    }
}

fixDatabase();
