//import data to mongodb
import 'dotenv/config'
import { MongoClient } from 'mongodb';
import { getFolderNames } from '../getFolderNames.js';
import getJsonDataFileNameFromFolder from '../file/getJsonDataFromFolder.mjs'

import getBaseDomain from '../getBaseDomain.js';
const uri = "mongodb://localhost:27017"; // Replace with your MongoDB URI
const dbName = "grit-success-aggregation";
const collectionName = "products";

const LOCAL = process.env.LOCAL


const foldNmes = await getFolderNames('data/1.0.step-data/unzipped-data')
debugger
let datas = []

if (LOCAL === 'true') {
  
    const FOLDER = process.env.FOLDER
    const data1 = await getJsonDataFileNameFromFolder(`data/1.0.step-data/unzipped-data/${FOLDER}`)
debugger

    for (let brandData of data1) {
      
        const firstObj =brandData[0]
        const HOSTNAME =process.env.HOSTNAME
   
        const host = getBaseDomain(firstObj.link,firstObj)
        if(host ===HOSTNAME){
            datas = [brandData]
            debugger
        }



    }
    debugger

} else {
    debugger
    for (let folder of foldNmes) {
        debugger

        const data1 = await getJsonDataFileNameFromFolder(`data/1.0.step-data/unzipped-data/${folder}`)
        debugger
        datas = [...datas, ...data1]


        debugger

    }

}

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
            await db.collection(collectionName).insertMany(data.filter((f => !f.error)).map(m => { return { ...m, pageURLString: m.pageURL.replace(/\./g, '_'), imgString: m.img ? m.img.replace(/\./g, '_') : '' } }));
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