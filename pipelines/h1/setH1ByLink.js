import fs from 'fs';

function setH1ByLink({ id }) {
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
                            if (!targetObject.link || targetObject.link.trim() === "") {
                                return null;
                            }

                            // Check if h1 property exists and is not null
                            if (targetObject.h1 !== null) {
                                return targetObject.h1;
                            }

                            const linkLower = targetObject.link.toLowerCase();
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

export default setH1ByLink;