import fs from 'fs';

function setH3ByLink({ id }) {
    const keywordsObject = JSON.parse(fs.readFileSync(`${process.cwd()}/data/2.step-data/productnames-${id}.json`));

    // Preprocess keywordsObject into a plain object for faster lookup
    const keywordsObjectFlat = {};

    keywordsObject.forEach(category => {
        for (const subCategory in category) {
            for (const item in category[subCategory]) {
                const keywords = category[subCategory][item];
                keywords.forEach(keyword => {
                    const normalizedKeyword = keyword.toLowerCase();
                    keywordsObjectFlat[normalizedKeyword] = subCategory; // Map keyword to subCategory
                });
            }
        }
    });

    return {
        $addFields: {
            h3: {
                $function: {
                    body: `
                        function(targetObject, keywordsObjectFlat) {
                            if (!targetObject.link || targetObject.link.trim() === "") {
                                return null;
                            }

                            // Check if h3 property exists and is not null
                            if (targetObject.hasOwnProperty('h3') && targetObject.h3 !== null) {
                                return targetObject.h3;
                            }

                            const linkLower = targetObject.link.toLowerCase();

                            // Look for matching keyword in the flat object
                            for (const keyword in keywordsObjectFlat) {
                                if (linkLower.includes(keyword)) {
                                    return keywordsObjectFlat[keyword]; // Return the matched subCategory
                                }
                            }

                            return null;
                        }
                    `,
                    args: ["$$ROOT", keywordsObjectFlat],
                    lang: "js"
                }
            }
        }
    };
}

export default setH3ByLink;

