import fs from 'fs';

// Preprocess the keywords object into a flat lookup map (key: keyword, value: item)
function preprocessKeywords(keywordsObject) {
    const keywordLookup = {};

    keywordsObject.forEach(category => {
        for (const subCategory in category) {
            for (const item in category[subCategory]) {
                const keywords = category[subCategory][item];
                keywords.forEach(keyword => {
                    const sanitizedKeyword = keyword.toLowerCase()//.replace(/\./g, '_');
                    keywordLookup[sanitizedKeyword.toLowerCase()] = item;
                });
            }
        }
    });

    return keywordLookup;
}

// Generalized function to set H4 based on any field (link, pageURL, or title)
function setH4ByField({ id, field }) {
    const keywordsObject = JSON.parse(fs.readFileSync(`${process.cwd()}/data/2.step-data/productnames-${id}.json`));
    const keywordLookup = preprocessKeywords(keywordsObject); // Preprocess once

    return {
        $addFields: {
            h4: {
                $function: {
                    body: `
                        function(targetObject, keywordLookup, field) {
                            // Ensure the field exists and is not empty
                            if (!targetObject[field] || targetObject[field].trim() === "") {
                                return null;
                            }

                            // Check if h4 already exists and is not null
                            if (targetObject.hasOwnProperty('h4') && targetObject.h4 !== null) {
                                return targetObject.h4;
                            }

                            // Convert the field value to lowercase for case-insensitive comparison
                            const fieldValueLower = targetObject[field].toLowerCase()//.replace(/\./g, '_');

                            // Search for a matching keyword in the precomputed keywordLookup
                            for (const keyword in keywordLookup) {
                                if (fieldValueLower.includes(keyword)) {
                                    return keywordLookup[keyword];
                                }
                            }

                            return null;
                        }
                    `,
                    args: ["$$ROOT", keywordLookup, field], // Pass the field dynamically
                    lang: "js"
                }
            }
        }
    };
}

export default setH4ByField;
