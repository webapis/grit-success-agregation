

import fs from 'fs';

function setH3ByTitle({ id }) {
    const keywordsObject = JSON.parse(fs.readFileSync(`${process.cwd()}/data/2.step-data/productnames-${id}.json`));

    // Create a plain object for keyword lookups
    const keywordMap = {};
    for (const category of keywordsObject) {
        for (const subCategory in category) {
            for (const item in category[subCategory]) {
                const keywords = category[subCategory][item];
                keywords.forEach(keyword => {
                    keywordMap[keyword.toLowerCase()] = subCategory;
                });
            }
        }
    }

    return {
        $addFields: {
            h3: {
                $function: {
                    body: `
                        function(targetObject, keywordMap) {
                            if (!targetObject.title || targetObject.title.trim() === "") {
                                return null;
                            }

                            // Check if h3 property exists and is not null
                            if (targetObject.h3 !== null) {
                                return targetObject.h3;
                            }

                            const linkLower = targetObject.title.toLowerCase();
                            for (const keyword in keywordMap) {
                                if (linkLower.includes(keyword)) {
                                    return keywordMap[keyword]; // Return the top-level category
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

export default setH3ByTitle;
// import fs from 'fs';
// function setH3ByTitle({ id }) {
//     const keywordsObject = JSON.parse(fs.readFileSync(`${process.cwd()}/data/2.step-data/productnames-${id}.json`));

//     return {
//         $addFields: {
//             h3: {
//                 $function: {
//                     body: `
//                         function(targetObject, keywordsObject) {
//                             if (!targetObject.title || targetObject.title.trim() === "") {
//                                 return null;
//                             }

//                             // Check if h3 property exists and is not null
//                             if (targetObject.hasOwnProperty('h3') && targetObject.h3 !== null) {
//                                 return targetObject.h3;
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

// export default setH3ByTitle;