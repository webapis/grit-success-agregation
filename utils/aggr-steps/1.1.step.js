//import data to mongodb

import { MongoClient } from 'mongodb';
import getJsonDataFileNameFromFolder from '../file/getJsonDataFromFolder.mjs'
const uri = "mongodb://localhost:27017"; // Replace with your MongoDB URI
const dbName = "grit-success-aggregation";
const collectionName = "products";
const datas = await getJsonDataFileNameFromFolder('data/1.0.step-data/unzipped-data/sponsor-product')
debugger
async function importCollection() {
    const client = new MongoClient(uri, { useUnifiedTopology: true });

    try {
        // Connect to the MongoDB server
        await client.connect();

        console.log("Connected to database");

        const db = client.db(dbName);
        // Drop the specified collection
        const collections = await db.listCollections().toArray();
        const collectionExists = collections.some(col => col.name === collectionName);

        if (collectionExists) {
            const result = await db.collection(collectionName).drop();
            console.log(`Collection ${collectionName} dropped successfully:`, result);
        }

        let counter = 0
        for (let data of datas) {
            debugger
            counter = counter + data.filter((f => !f.error)).length
debugger
            await db.collection(collectionName).insertMany(data.filter((f => !f.error)));
            console.log('total imported data: ', counter)
        }

    } catch (error) {
        console.error("Error dropping collection:", error);
    } finally {
        // Close the connection
        await client.close();
    }
}

// Call the function to drop the collection
importCollection();