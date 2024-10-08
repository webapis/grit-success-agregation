import { MongoClient } from 'mongodb';
import fs from 'fs';
import { makeDirectory } from 'make-dir';
import groupByh from './pipelines/group/groupByh.js'
const uri = "mongodb://localhost:27017"; // Replace with your MongoDB URI
const dbName = "grit-success-aggregation";
const collectionName = "aggregated";

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function runAggregation() {
    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionName);
        const totalDocsBefore = await collection.countDocuments();
        console.log(`Total documents before aggregation: ${totalDocsBefore}`);
        debugger
        const pipeline = [

            

                ...groupByh
                // Optionally project only relevant fields

            
        ];

        const cursor = collection.aggregate(pipeline);

        // Fetch all documents and convert them to an array
        const results = await cursor.toArray();
        // Count the documents after performing aggregation
        const totalDocsAfter = results.length;
        console.log(`Total documents after aggregation: ${totalDocsAfter}`);

        // Separate results into two categories: h1 matched and "diğer" fallback

        const h1data = results

        await makeDirectory('data')

        fs.writeFileSync('data/grouped.json', JSON.stringify(h1data, null, 2));

        console.log("Data written to h1.json and h1Diger.json");

    } catch (error) {
        console.error("Error running aggregation:", error);
    } finally {
        // Close MongoDB connection
        await client.close();
        console.log("MongoDB connection closed.");
    }
}


runAggregation();