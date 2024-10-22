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

function setH1ByPageURL({ id }) {
    const keywordsObject = JSON.parse(fs.readFileSync(`${process.cwd()}/data/2.step-data/productnames--${id}.json`));
    const keywordMap = preprocessKeywords(keywordsObject); // Preprocess once

    return {
        $addFields: {
            h1: {
                $function: {
                    body: `
                        function(targetObject, keywordMap) {
                            if (!targetObject.pageURL || targetObject.pageURL.trim() === "") {
                                return null;
                            }

                            // If h1 exists, return it
                            if (targetObject.hasOwnProperty('h1') && targetObject.h1 !== null) {
                                return targetObject.h1;
                            }

                            const pageURL = targetObject.pageURL.toLowerCase();
                            
                            // Check each keyword in the preprocessed map
                            for (const keyword in keywordMap) {
                                if (pageURL.includes(keyword)) {
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

export default setH1ByPageURL;


