import { MongoClient } from 'mongodb';
import fs from 'fs';
import firstpipe from './pipelines/h1/firstpipe.js';
import secondpipe from './pipelines/h1/secondpipe.js'
import thirdpipe from './pipelines/h1/third.js'
import forthpipe from './pipelines/h2/gender/forth.js'
import fifthpipe from './pipelines/h2/gender/fifth.js'
import sixes from './pipelines/h2/gender/sixes.js'
import seventh from './pipelines/h2/gender/seventh.js'
import eighth from './pipelines/h2/gender/eighth.js'
import nine from './pipelines/h2/gender/nine.js'
import ten from './pipelines/h2/gender/ten.js'
import eleven from './pipelines/h2/gender/eleven.js'
import twelve from './pipelines/h2/gender/twelve.js'
const uri = "mongodb://localhost:27017"; // Replace with your MongoDB URI
const dbName = "grit-success-aggregation";
const collectionName = "products";

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function runAggregation() {
    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionName);


        const pipeline = [
            firstpipe,
            secondpipe,
            thirdpipe,
            forthpipe,
            ...fifthpipe,
            ...sixes,
            ...seventh,
            eighth,
            nine,
            ...ten,
            ...eleven,
            twelve,
            {
                // Optionally project only relevant fields
                $project: {
                    title: 1,
                    h1: 1,
                    h2: 2,
                    price: 1,
                    currency: 1,
                    link: 1,
                    pageUrl: 1,
                    pageTitle: 1
                }
            }
        ];

        const cursor = collection.aggregate(pipeline);

        // Fetch all documents and convert them to an array
        const results = await cursor.toArray();

        // Separate results into two categories: h1 matched and "diğer" fallback
        const digerh1 = results.filter(f => f.h1 === 'diğer');
        const h1data = results.filter(f => f.h1 !== 'diğer');

        // Write the filtered results to respective JSON files
        fs.writeFileSync('h1Diger.json', JSON.stringify(digerh1, null, 2));
        fs.writeFileSync('h1.json', JSON.stringify(h1data, null, 2));

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
