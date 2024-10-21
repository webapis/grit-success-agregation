import fs from 'fs';

function preprocessKeywords(keywordsObject) {
    // Create a mapping from keywords to subCategories
    const keywordMap = {};

    keywordsObject.forEach(category => {
        for (const subCategory in category) {
            for (const item in category[subCategory]) {
                const keywords = category[subCategory][item];
                // Map each keyword to its subCategory
                keywords.forEach(keyword => {
                    keywordMap[keyword.toLowerCase()] = subCategory;
                });
            }
        }
    });

    return keywordMap;
}

function setH1ByLink({ id }) {
    const keywordsObject = JSON.parse(fs.readFileSync(`${process.cwd()}/data/2.step-data/productnames--${id}.json`));
    const keywordMap = preprocessKeywords(keywordsObject); // Preprocess once

    return {
        $addFields: {
            h1: {
                $function: {
                    body: `
                        function(targetObject, keywordMap) {
                            if (!targetObject.link || targetObject.link.trim() === "") {
                                return null;
                            }

                            // If h1 exists, return it
                            if (targetObject.hasOwnProperty('h1') && targetObject.h1 !== null) {
                                return targetObject.h1;
                            }

                            const link = targetObject.link.toLowerCase();
                            
                            // Check each keyword in the preprocessed map
                            for (const keyword in keywordMap) {
                                if (link.includes(keyword)) {
                                    return keywordMap[keyword]; // Return the corresponding subCategory
                                }
                            }

                            return null;
                        }
                    `,
                    args: ["$$ROOT", keywordMap],
                    lang: "js"
                }
            }
        }
    }
}

export default setH1ByLink;


// import fs from 'fs';
// function setH1ByLink({ id }) {
//     const keywordsObject = JSON.parse(fs.readFileSync(`${process.cwd()}/data/2.step-data/productnames--${id}.json`));

//     return {
//         $addFields: {
//             h1: {
//                 $function: {
//                     body: `
//                         function(targetObject, keywordsObject) {
//                             if (!targetObject.link || targetObject.link.trim() === "") {
//                                 return null;
//                             }

//                             // Check if h1 property exists and is not null
//                             if (targetObject.hasOwnProperty('h1') && targetObject.h1 !== null) {
//                                 return targetObject.h1;
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
//                                         const matchedKeyword = matchKeyword(targetObject.link, keywords);

//                                         if (matchedKeyword) {
//                                             return subCategory; // Return the top-level category
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

// export default setH1ByLink;