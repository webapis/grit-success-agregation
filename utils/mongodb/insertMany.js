import { MongoClient } from 'mongodb';

const uri = "mongodb://localhost:27017"; // Replace with your MongoDB URI
const dbName = "grit-success-aggregation";
const collectionName = "products";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const insertData = async (data) => {
    try {
        // Connect to MongoDB server
        await client.connect();
        console.log("Connected to MongoDB!");


        // Access the database and collection
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        // Insert multiple documents into the collection
        const { insertedCount } = await collection.insertMany(data);

        // Log how many documents were inserted
        console.log(`${insertedCount} documents were inserted successfully`);

    } catch (error) {
        console.error("Error inserting documents:", error);
    } finally {
        // Close the MongoDB connection
        await client.close();
        console.log("Connection closed.");
    }
};


export default insertData



// import getJsonDataFromFolder from "./utils/file/getJsonDataFromFolder.mjs";
// import insertData from "./utils/mongodb/insertMany.js";
// const data = await getJsonDataFromFolder('/sponsor-kiyafeti-data/unzipped-data/sponsor')
// const flatData =data.flat()
// debugger
// await insertData(flatData)


/*
{
        "image": "https://akn-lmb-adl.a-cdn.akinoncdn.com/products/2023/05/04/416045/b9c65d22-6552-40b9-a95a-553dfe386ab6_size580x870_cropTop.jpg",
        "title": "Empirme Sarı Toçev 70*70 Desenli Şal",
        "price": "699.95 ",
        "link": "https://www.adl.com.tr/tocev-70-70-desenli-sal-8681927522039/",
        "currency": "TL",
        "pageTitle": "adL.com.tr",
        "pageUrl": "https://www.adl.com.tr/tocev/?category_ids=694",
        "marka": "adl"
    
}

 {
        "image":  "https://cdn.qukasoft.com/f/435880/b2NhVUoyVTArYkI4Tmk4Z1RvTTZKYms9/p/yazlik-kadin-fileli-kemerli-hasir-fotr-sapka-6223-4887638-sw2982sh3648.webp",
        "title": "Yazlık Kadın Fileli Kemerli Hasır Fötr Şapka turuncu 6223",
        "price": "499,00",
        "link": "https://www.baysapkaci.com.tr/yazlik-kadin-fileli-kemerli-hasir-fotr-sapka-turuncu-6223",
        "currency": "TL",
        "pageTitle": "Tüm Ürünler | Kasket-Fötr-Geniş Kenarlı Şapka-Plaj Çantası",
        "pageUrl": "https://www.baysapkaci.com.tr/tumu-c-0",

        "marka": "baysapkaci"
    },
*/