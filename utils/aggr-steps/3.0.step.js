import { MongoClient } from 'mongodb';
import fs from 'fs';
import { makeDirectory } from 'make-dir';
import setGenderByHostNameMatch_1 from '../../pipelines/h2/gender/1.setGenderByHostNameMatch.js';
import setGenderByTitle_2 from '../../pipelines/h2/gender/2.setGenderByTitle.js';
import setGenderByField from '../../pipelines/h2/gender/2.setGenderByField.js';
import setGenderByPageURLContent_3 from '../../pipelines/h2/gender/3.setGenderByPageURLContent.js'
import setGenderByPageTitle_4 from '../../pipelines/h2/gender/4.setGenderByPageTitle.js'
import setGenderByPageUrl_5 from '../../pipelines/h2/gender/5.setGenderByPageUrl.js'

/* import setGenderByLinkAndTitleContentMatch from '../../pipelines/h2/gender/setGenderByLinkAndTitleContentMatch.js';
import setGenderByPageUrlContentMatch from '../../pipelines/h2/gender/setGenderByPageUrlContentMatch.js';
import setGenderByPageUrl from '../../pipelines/h2/gender/setGenderByPageUrl.js';
import setGenderByPageUrlAndTitleContentMatch from '../../pipelines/h2/gender/setGenderByPageUrlAndTitleContentMatch.js';
import setGenderByPageTitleContentMatch from '../../pipelines/h2/gender/setGenderByPageTitleContentMatch.js';
import setGenderByPageUrlNegativeCombinationMatch from '../../pipelines/h2/gender/setGenderByPageUrlNegativeCombinationMatch.js';
import setGenderByHostNameAndTitleContentMatch from '../../pipelines/h2/gender/setGenderByHostNameAndTitleContentMatch.js';
import setDefaulth2 from '../../pipelines/h2/ev-yasam/setDefaulth2.js'; */


import setH5ByHostName from '../../pipelines/h5/setHostName.js';



import setH1ByField from '../../pipelines/h1/setH1ByField.js'
import setH3ByField from '../../pipelines/h3-h4/setH3ByField.js'
import setH3ByFieldUrl from '../../pipelines/h3-h4/setH3ByFieldUrl.js'
import setH4ByField from '../../pipelines/h4/setH4ByField.js'
const uri = "mongodb://localhost:27017"; // Replace with your MongoDB URI
const dbName = "grit-success-aggregation";
const collectionName = "products";

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function runAggregation() {
    const startTime = Date.now(); // Start timer for the entire aggregation process

    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionName);
        const totalDocsBefore = await collection.countDocuments();
        console.log(`Total documents before aggregation: ${totalDocsBefore}`);

        const pipeline = [

            setH1ByField({ id: 1, field: 'title' }),
            setH1ByField({ id: 2, field: 'title' }),
            setH1ByField({ id: 3, field: 'title' }),
            setH1ByField({ id: 4, field: 'title' }),

            setH1ByField({ id: 1, field: 'link' }),
            setH1ByField({ id: 2, field: 'link' }),
            setH1ByField({ id: 3, field: 'link' }),
            setH1ByField({ id: 4, field: 'link' }),

            setH1ByField({ id: 1, field: 'pageURLString' }),
            setH1ByField({ id: 2, field: 'pageURLString' }),
            setH1ByField({ id: 3, field: 'pageURLString' }),
            setH1ByField({ id: 4, field: 'pageURLString' }),
            setGenderByHostNameMatch_1, // h2
            ...setGenderByField({ id: 0, field: 'title' }),
            ...setGenderByField({ id: 0, field: 'pageURLString' }),
            ...setGenderByField({ id: 0, field: 'link' }),
            ...setGenderByField({ id: 0, field: 'img' }),

            ...setGenderByField({ id: 1, field: 'title' }),
            ...setGenderByField({ id: 1, field: 'pageURLString' }),
            ...setGenderByField({ id: 1, field: 'link' }),
            ...setGenderByField({ id: 1, field: 'img' }),

            ...setGenderByField({ id: 0, field: 'pageTitle' }),
            ...setGenderByField({ id: 1, field: 'pageTitle' }),
            setGenderByPageUrl_5,
            // ...setGenderByKeywordsMatchInTitleAndLinkContent({ id: 0 }),
            // ...setGenderByLinkAndTitleContentMatch, // h2
            // setGenderByPageUrlContentMatch, // h2
            //setGenderByPageUrl, // h2
            // ...setGenderByPageUrlAndTitleContentMatch, // h2
            // ...setGenderByPageTitleContentMatch, // h2
            // setGenderByPageUrlNegativeCombinationMatch, // h2
            // ...setGenderByHostNameAndTitleContentMatch, // h2
            // setDefaulth2,

            setH3ByFieldUrl({ id: 1, field: 'pageURLString' }),
            setH3ByFieldUrl({ id: 2, field: 'pageURLString' }),
            setH3ByFieldUrl({ id: 3, field: 'pageURLString' }),
            setH3ByFieldUrl({ id: 4, field: 'pageURLString' }),

            setH3ByField({ id: 1, field: 'title' }),
            setH3ByField({ id: 2, field: 'title' }),
            setH3ByField({ id: 3, field: 'title' }),
            setH3ByField({ id: 4, field: 'title' }),

            setH3ByField({ id: 1, field: 'link' }),
            setH3ByField({ id: 2, field: 'link' }),
            setH3ByField({ id: 3, field: 'link' }),
            setH3ByField({ id: 4, field: 'link' }),

            setH3ByField({ id: 1, field: 'pageURLString' }),
            setH3ByField({ id: 2, field: 'pageURLString' }),
            setH3ByField({ id: 3, field: 'pageURLString' }),
            setH3ByField({ id: 4, field: 'pageURLString' }),


            setH4ByField({ id: 1, field: 'title' }),
            setH4ByField({ id: 2, field: 'title' }),
            setH4ByField({ id: 3, field: 'title' }),
            setH4ByField({ id: 4, field: 'title' }),

            setH4ByField({ id: 1, field: 'link' }),
            setH4ByField({ id: 2, field: 'link' }),
            setH4ByField({ id: 3, field: 'link' }),
            setH4ByField({ id: 4, field: 'link' }),

            setH4ByField({ id: 1, field: 'pageURLString' }),
            setH4ByField({ id: 2, field: 'pageURLString' }),
            setH4ByField({ id: 3, field: 'pageURLString' }),
            setH4ByField({ id: 4, field: 'pageURLString' }),
            setH5ByHostName,
            {
                // Optionally project only relevant fields
                $project: {
                    title: 1,
                    img: 1,
                    h1: 1,
                    h2: 2,
                    price: 1,
                    currency: 1,
                    link: 1,
                    pageURL: 1,
                    pageURLString:1,
                    pageTitle: 1,
                    h3: 1,
                    h4: 1,
                    h5: 1
                }
            }
        ];

        const cursor = collection.aggregate(pipeline);

        let processedCount = 0; // Counter for processed documents

        // Fetch all documents and convert them to an array
        const results = [];
        while (await cursor.hasNext()) {
            const doc = await cursor.next();
            results.push(doc);
            processedCount++;

            // Log progress every 100 documents
            if (processedCount % 100 === 0) {
                const elapsedTime = Date.now() - startTime; // Elapsed time in milliseconds
                const estimatedTotalTime = (elapsedTime / processedCount) * totalDocsBefore; // Estimated total time
                const estimatedRemainingTime = estimatedTotalTime - elapsedTime; // Remaining time

                console.log(`Processed ${processedCount} of ${totalDocsBefore} documents.`);
                console.log(`Estimated remaining time: ${(estimatedRemainingTime / 1000).toFixed(2)} seconds`);
            }
        }

        const totalDocsAfter = results.length;
        console.log(`Total documents after aggregation: ${totalDocsAfter}`);

        // Write results to file
        await makeDirectory('data/3.0.step-data');
        fs.writeFileSync('data/3.0.step-data/aggregated.json', JSON.stringify(results, null, 2));

        console.log("Data written to aggregated.json");

    } catch (error) {
        console.error("Error running aggregation:", error);
    } finally {
        await client.close();

        // Calculate and log the total time taken for the aggregation
        const totalTimeTaken = Date.now() - startTime; // Total time in milliseconds
        console.log(`Total time taken for aggregation: ${(totalTimeTaken / 1000).toFixed(2)} seconds`);

        console.log("MongoDB connection closed.");
    }
}

runAggregation();