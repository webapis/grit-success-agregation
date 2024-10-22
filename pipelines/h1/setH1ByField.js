import fs from 'fs';

// Preprocess the keywords object into a keyword-subCategory map
function preprocessKeywords(keywordsObject) {
    const keywordMap = {};

    keywordsObject.forEach(category => {
        for (const subCategory in category) {
            for (const item in category[subCategory]) {
                const keywords = category[subCategory][item];
                keywords.forEach(keyword => {
                    keywordMap[keyword.toLowerCase()] = subCategory;
                });
            }
        }
    });

    return keywordMap;
}

// Combine all the stages into a single stage
function setH1ByField({ id, field }) {
    const keywordsObject = JSON.parse(fs.readFileSync(`${process.cwd()}/data/2.step-data/productnames--${id}.json`));
    const keywordMap = preprocessKeywords(keywordsObject); // Preprocess once

    return {
        $addFields: {
            h1: {
                $function: {
                    body: `
                        function(targetObject, keywordMap, field) {
                            // Check if the field exists and is not empty
                            if (!targetObject[field] || targetObject[field].trim() === "") {
                                return null;
                            }

                            // If h1 exists, return it
                            if (targetObject.hasOwnProperty('h1') && targetObject.h1 !== null) {
                                return targetObject.h1;
                            }

                            // Get the value from the specified field
                            const value = targetObject[field].toLowerCase();
                            
                            // Check each keyword in the preprocessed map
                            for (const keyword in keywordMap) {
                                if (value.includes(keyword)) {
                                    return keywordMap[keyword]; // Return the corresponding subCategory
                                }
                            }

                            return null;
                        }
                    `,
                    args: ["$$ROOT", keywordMap, field], // Pass the field as an argument
                    lang: "js"
                }
            }
        }
    };
}

export default setH1ByField;
