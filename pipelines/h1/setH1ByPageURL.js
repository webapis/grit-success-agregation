
import fs from 'fs';

function setH1ByPageURL({ id }) {
    const keywordsObject = JSON.parse(fs.readFileSync(`${process.cwd()}/data/2.step-data/productnames--${id}.json`));

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
            h1: {
                $function: {
                    body: `
                        function(targetObject, keywordMap) {
                            if (!targetObject.pageURL || targetObject.pageURL.trim() === "") {
                                return null;
                            }

                            // Check if h1 property exists and is not null
                            if (targetObject.h1 !== null) {
                                return targetObject.h1;
                            }

                            const linkLower = targetObject.pageURL.toLowerCase();
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

export default setH1ByPageURL;
// import fs from 'fs';
// function setH1ByPageURL({ id }) {
//     const keywordsObject = JSON.parse(fs.readFileSync(`${process.cwd()}/data/2.step-data/productnames--${id}.json`));

//     return {
//         $addFields: {
//             h1: {
//                 $function: {
//                     body: `
//                         function(targetObject, keywordsObject) {
//                             if (!targetObject.pageURL || targetObject.pageURL.trim() === "") {
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
//                                         const matchedKeyword = matchKeyword(targetObject.pageURL, keywords);

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

// export default setH1ByPageURL;