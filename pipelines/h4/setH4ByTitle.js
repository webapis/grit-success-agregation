

import fs from 'fs';

function setH4ByTitle({ id }) {
    const keywordsObject = JSON.parse(fs.readFileSync(`${process.cwd()}/data/2.step-data/productnames-${id}.json`));

    // Create a plain object for keyword lookups
    const keywordMap = {};
    for (const category of keywordsObject) {
        for (const subCategory in category) {
            for (const item in category[subCategory]) {
                const keywords = category[subCategory][item];
                keywords.forEach(keyword => {
                    keywordMap[keyword.toLowerCase()] = item; // Map keyword to item
                });
            }
        }
    }

    return {
        $addFields: {
            h4: {
                $function: {
                    body: `
                        function(targetObject, keywordMap) {
                            if (!targetObject.title || targetObject.title.trim() === "") {
                                return null;
                            }

                            // Check if h4 property exists and is not null
                            if (targetObject.h4 !== null) {
                                return targetObject.h4;
                            }

                            const linkLower = targetObject.title.toLowerCase();
                            for (const keyword in keywordMap) {
                                if (linkLower.includes(keyword)) {
                                    return keywordMap[keyword]; // Return the item as a string
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

export default setH4ByTitle;

// import fs from 'fs';

// function setH4ByTitle({ id }) {
//     const keywordsObject = JSON.parse(fs.readFileSync(`${process.cwd()}/data/2.step-data/productnames-${id}.json`));

//     return {
//         $addFields: {
//             h4: {
//                 $function: {
//                     body: `
//                         function(targetObject, keywordsObject) {
//                             if (!targetObject.title || targetObject.title.trim() === "") {
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
//                                         const matchedKeyword = matchKeyword(targetObject.title, keywords);

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

// export default setH4ByTitle;