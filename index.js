import { MongoClient } from 'mongodb';
import fs from 'fs';
import categorizeByTitleAndMetaData from './pipelines/h1/categorizeByTitleAndMetaData.js';
import categorizeByLinkAndMetaData from './pipelines/h1/categorizeByLinkAndMetaData.js'
import setGenderByHostNameMatch from './pipelines/h2/gender/setGenderByHostNameMatch.js'
import setGenderByKeywordsMatchInTitleAndLinkContent from './pipelines/h2/gender/setGenderByKeywordsMatchInTitleAndLinkContent.js'
import setGenderByLinkAndTitleContentMatch from './pipelines/h2/gender/setGenderByLinkAndTitleContentMatch.js'
import setGenderByPageUrlContentMatch from './pipelines/h2/gender/setGenderByPageUrlContentMatch.js'
import setGenderByPageUrl from './pipelines/h2/gender/setGenderByPageUrl.js'
import setGenderByPageUrlAndTitleContentMatch from './pipelines/h2/gender/setGenderByPageUrlAndTitleContentMatch.js'
import setGenderByPageTitleContentMatch from './pipelines/h2/gender/setGenderByPageTitleContentMatch.js'
import setGenderByPageUrlNegativeCombinationMatch from './pipelines/h2/gender/setGenderByPageUrlNegativeCombinationMatch.js'
import setGenderByHostNameAndTitleContentMatch from './pipelines/h2/gender/setGenderByHostNameAndTitleContentMatch.js'
import setDefaulth2 from './pipelines/h2/ev-yasam/setDefaulth2.js'
import categorizeH1ByH2 from './pipelines/h1/categorizeH1ByH2.js'
import categorizeByTitleLinkPageUrl from './pipelines/h3-h4/categorizeByTitleLinkPageUrl.js'
import setH4ByTitleLink from './pipelines/h4/setH4ByTitleLink.js';
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
            categorizeByTitleAndMetaData({ giyim: 'giyim', yasam: 'ev-ve-yasam', taki: 'taki-ve-mucevher', kozmetik: 'kozmetik-kisisel-bakim', h: 'h1' }),//h1
            categorizeByTitleAndMetaData({ giyim: 'giyim2', yasam: 'ev-ve-yasam', taki: 'taki-ve-mucevher', kozmetik: 'kozmetik-kisisel-bakim', h: 'h1' }),//h1
            categorizeByLinkAndMetaData,//h1
            setGenderByHostNameMatch,//h2
            ...setGenderByKeywordsMatchInTitleAndLinkContent,
            ...setGenderByLinkAndTitleContentMatch,//h2
            setGenderByPageUrlContentMatch,//h2
            setGenderByPageUrl,//h2
            ...setGenderByPageUrlAndTitleContentMatch,//h2
            ...setGenderByPageTitleContentMatch,//h2
            setGenderByPageUrlNegativeCombinationMatch,//h2
            ...setGenderByHostNameAndTitleContentMatch,//h2
            setDefaulth2,
            categorizeH1ByH2,

            ...setH4ByTitleLink({ catid: 1 }),//h4
            ...setH4ByTitleLink({ catid: 2 }),//h4
            ...setH4ByTitleLink({ catid: 3 }),//h4
            ...setH4ByTitleLink({ catid: 4 }),//h4
            ...setH4ByTitleLink({ catid: 0 }),//h4
            categorizeByTitleLinkPageUrl,//h3
            {
                // Optionally project only relevant fields
                $project: {
                    title: 1,
                    h1: 1,
                    stageh1: 1,
                    h2: 2,
                    price: 1,
                    currency: 1,
                    link: 1,
                    pageUrl: 1,
                    pageTitle: 1,
                    h3: 1,
                    h4: 1
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
