//aggregate data
import { MongoClient } from 'mongodb';
import fs from 'fs';
import { makeDirectory } from 'make-dir';
import setGenderByHostNameMatch from '../../pipelines/h2/gender/setGenderByHostNameMatch.js'
import setGenderByKeywordsMatchInTitleAndLinkContent from '../../pipelines/h2/gender/setGenderByKeywordsMatchInTitleAndLinkContent.js'
import setGenderByLinkAndTitleContentMatch from '../../pipelines/h2/gender/setGenderByLinkAndTitleContentMatch.js'
import setGenderByPageUrlContentMatch from '../../pipelines/h2/gender/setGenderByPageUrlContentMatch.js'
import setGenderByPageUrl from '../../pipelines/h2/gender/setGenderByPageUrl.js'
import setGenderByPageUrlAndTitleContentMatch from '../../pipelines/h2/gender/setGenderByPageUrlAndTitleContentMatch.js'
import setGenderByPageTitleContentMatch from '../../pipelines/h2/gender/setGenderByPageTitleContentMatch.js'
import setGenderByPageUrlNegativeCombinationMatch from '../../pipelines/h2/gender/setGenderByPageUrlNegativeCombinationMatch.js'
import setGenderByHostNameAndTitleContentMatch from '../../pipelines/h2/gender/setGenderByHostNameAndTitleContentMatch.js'
import setDefaulth2 from '../../pipelines/h2/ev-yasam/setDefaulth2.js'

import setH4ByTitle from '../../pipelines/h4/setH4ByTitle.js'
import setH3ByTitle from '../../pipelines/h3-h4/setH3ByTitle.js'
import setH1ByTitle from '../../pipelines/h1/setH1ByTitle.js'
import setH5ByHostName from '../../pipelines/h5/setHostName.js'

import setH1ByPageURL from '../../pipelines/h1/setH1ByPageURL.js'
import setH1ByLink from '../../pipelines/h1/setH1ByLink.js'
import setH3BypageURL from '../../pipelines/h3-h4/setH3BypageURL.js'
import setH4ByPageURL from '../../pipelines/h4/setH4ByPageURL.js'
import setH3ByLink from '../../pipelines/h3-h4/setH3ByLink.js'
import setH4ByLink from '../../pipelines/h4/setH4ByLink.js'
const uri = "mongodb://localhost:27017"; // Replace with your MongoDB URI
const dbName = "grit-success-aggregation";
const collectionName = "products";

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
            setH1ByTitle({ id: 1 }),
            setH1ByTitle({ id: 2 }),
            setH1ByTitle({ id: 3 }),
            setH1ByTitle({ id: 4 }),

            setH1ByPageURL({ id: 1 }),
            setH1ByPageURL({ id: 2 }),
            setH1ByPageURL({ id: 3 }),
            setH1ByPageURL({ id: 4 }),
            setH1ByLink({ id: 1 }),
            setH1ByLink({ id: 2 }),
            setH1ByLink({ id: 3 }),
            setH1ByLink({ id: 4 }),
            setGenderByHostNameMatch,//h2
            ...setGenderByKeywordsMatchInTitleAndLinkContent({ id: 0 }),
            //...setGenderByKeywordsMatchInTitleAndLinkContent({id:1}),
            ...setGenderByLinkAndTitleContentMatch,//h2

            setGenderByPageUrlContentMatch,//h2
            setGenderByPageUrl,//h2
            ...setGenderByPageUrlAndTitleContentMatch,//h2
            ...setGenderByPageTitleContentMatch,//h2
            setGenderByPageUrlNegativeCombinationMatch,//h2
            ...setGenderByHostNameAndTitleContentMatch,//h2
            setDefaulth2,


            setH3ByTitle({ id: 1 }),
            setH3ByTitle({ id: 2 }),
            setH3ByTitle({ id: 3 }),
            setH3ByTitle({ id: 4 }),

            setH3BypageURL({ id: 1 }),
            setH3BypageURL({ id: 2 }),
            setH3BypageURL({ id: 3 }),
            setH3BypageURL({ id: 4 }),

            setH3ByLink({ id: 1 }),
            setH3ByLink({ id: 2 }),
            setH3ByLink({ id: 3 }),
            setH3ByLink({ id: 4 }),

            setH4ByTitle({ id: 1 }),
            setH4ByTitle({ id: 2 }),
            setH4ByTitle({ id: 3 }),
            setH4ByTitle({ id: 4 }),

            setH4ByPageURL({ id: 1 }),
            setH4ByPageURL({ id: 2 }),
            setH4ByPageURL({ id: 3 }),
            setH4ByPageURL({ id: 4 }),

            setH4ByLink({ id: 1 }),
            setH4ByLink({ id: 2 }),
            setH4ByLink({ id: 3 }),
            setH4ByLink({ id: 4 }),
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
                    pageTitle: 1,
                    h3: 1,
                    h4: 1,
                    h5: 1

                }
            }
        ];

        const cursor = collection.aggregate(pipeline);

        // Fetch all documents and convert them to an array
        const results = await cursor.toArray();
        // Count the documents after performing aggregation
        const totalDocsAfter = results.length;
        console.log(`Total documents after aggregation: ${totalDocsAfter}`);

        // Separate results into two categories: h1 matched and "diğer" fallback

        const h1data = results.filter(f => f.h1 !== 'diğer');

        await makeDirectory('data/3.0.step-data')

        fs.writeFileSync('data/3.0.step-data/aggregated.json', JSON.stringify(h1data, null, 2));

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
