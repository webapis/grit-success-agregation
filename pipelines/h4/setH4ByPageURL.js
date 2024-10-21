import fs from 'fs';

function setH4ByPageURL({ id }) {
    // Load and preprocess the JSON file to build a lookup map for fast matching
    const keywordsObject = JSON.parse(fs.readFileSync(`${process.cwd()}/data/2.step-data/productnames-${id}.json`));

    // Preprocess the keywords object into a fast lookup map (key: keyword, value: item)
    const keywordLookup = {};

    for (const category of keywordsObject) {
        for (const subCategory in category) {
            for (const item in category[subCategory]) {
                const keywords = category[subCategory][item];
                for (const keyword of keywords) {
                    keywordLookup[keyword.toLowerCase()] = item;
                }
            }
        }
    }

    // MongoDB aggregation operation using precomputed keywordLookup
    return {
        $addFields: {
            h4: {
                $function: {
                    body: `
                        function(targetObject, keywordLookup) {
                            if (!targetObject.pageURL || targetObject.pageURL.trim() === "") {
                                return null;
                            }

                            // Check if h4 property exists and is not null
                            if (targetObject.hasOwnProperty('h4') && targetObject.h4 !== null) {
                                return targetObject.h4;
                            }

                            // Convert pageURL to lowercase to make case-insensitive comparisons
                            const pageURLLower = targetObject.pageURL.toLowerCase();

                            // Loop through the precomputed keywordLookup and find the match
                            for (const keyword in keywordLookup) {
                                if (pageURLLower.includes(keyword)) {
                                    return keywordLookup[keyword];
                                }
                            }

                            return null;
                        }
                    `,
                    args: ["$$ROOT", keywordLookup],
                    lang: "js"
                }
            }
        }
    };
}

export default setH4ByPageURL;


// import fs from 'fs';

// function setH4ByPageURL({ id }) {
//     const keywordsObject = JSON.parse(fs.readFileSync(`${process.cwd()}/data/2.step-data/productnames-${id}.json`));

//     return {
//         $addFields: {
//             h4: {
//                 $function: {
//                     body: `
//                         function(targetObject, keywordsObject) {
//                             if (!targetObject.pageURL || targetObject.pageURL.trim() === "") {
//                                 return null;
//                             }

//                             // Check if h4 property exists and is not null
//                             if (targetObject.hasOwnProperty('h4') && targetObject.h4 !== null) {
//                                 return targetObject.h4;
//                             }

//                             const matchKeyword = (title, keywords) => {
//                                 for (const keyword of keywords) {
//                                     if (title.toLowerCase().includes(keyword.toLowerCase())) {
//                                         return keyword;
//                                     }
//                                 }
//                                 return null;
//                             };

//                             for (const category of keywordsObject) {
//                                 for (const subCategory in category) {
//                                     for (const item in category[subCategory]) {
//                                         const keywords = category[subCategory][item];
//                                         const matchedKeyword = matchKeyword(targetObject.pageURL, keywords);

//                                         if (matchedKeyword) {
//                                             return item; // Return the item as a string
//                                         }
//                                     }
//                                 }
//                             }

//                             return null;
//                         }
//                     `,
//                     args: ["$$ROOT", keywordsObject],
//                     lang: "js"
//                 }
//             }
//         }
//     }
// }

// export default setH4ByPageURL;