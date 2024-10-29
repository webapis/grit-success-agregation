import fs from 'fs';

// Preprocess the keywords object into a flat object for fast lookup
function preprocessKeywords(keywordsObject) {
    const keywordsObjectFlat = {};

    keywordsObject.forEach(category => {
        for (const subCategory in category) {
            for (const item in category[subCategory]) {
                const keywords = category[subCategory][item];
                keywords.forEach(keyword => {
                    const normalizedKeyword = keyword.toLowerCase();

                    const sanitizedKeyword = normalizedKeyword//.replace(/\./g, '_');
                    keywordsObjectFlat[sanitizedKeyword] = subCategory;
                });
            }
        }
    });

    return keywordsObjectFlat;
}

// Generic function to set H3 based on the field (link, pageURL, or title)
function setH3ByField({ id, field }) {
    const keywordsObject = JSON.parse(fs.readFileSync(`${process.cwd()}/data/2.step-data/productnames-${id}.json`));
    const keywordsObjectFlat = preprocessKeywords(keywordsObject); // Preprocess once

    return {
        $addFields: {
            h3: {
                $function: {
                    body: `
                        function(targetObject, keywordsObjectFlat, field) {
                            // Check if the field exists and is not empty
                            if (!targetObject[field] || targetObject[field].trim() === "") {
                                return null;
                            }

                            // Check if h3 exists and is not null
                            if (targetObject.hasOwnProperty('h3') && targetObject.h3 !== null) {
                                return targetObject.h3;
                            }

                            const valueLower = targetObject[field].toLowerCase()//.replace(/\./g, '_');
                            
                            // Look for matching keyword in the flat object
                            for (const keyword in keywordsObjectFlat) {
                                if (valueLower.includes(keyword)) {
                                    return keywordsObjectFlat[keyword]; // Return the matched subCategory
                                }
                            }

                            return null;
                        }
                    `,
                    args: ["$$ROOT", keywordsObjectFlat, field], // Pass field as an argument
                    lang: "js"
                }
            }
        }
    };
}

export default setH3ByField;
//https://chatgpt.com/c/67168ecb-8a70-8000-9b40-6b4e8e0feb20