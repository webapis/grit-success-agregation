import fs from 'fs';

function setUnifiedFieldsByPageURLAndLink({ id }) {
    const keywordsObject = JSON.parse(fs.readFileSync(`${process.cwd()}/data/2.step-data/productnames-${id}.json`));

    return {
        $addFields: {
            h1: {
                $function: {
                    body: unifiedFunction,
                    args: ["$$ROOT", keywordsObject, "h1"],
                    lang: "js"
                }
            },
            h3: {
                $function: {
                    body: unifiedFunction,
                    args: ["$$ROOT", keywordsObject, "h3"],
                    lang: "js"
                }
            },
            h4: {
                $function: {
                    body: unifiedFunction,
                    args: ["$$ROOT", keywordsObject, "h4"],
                    lang: "js"
                }
            }
        }
    };
}

const unifiedFunction = `
    function(targetObject, keywordsObject, fieldType) {
        const checkAndMatch = (property) => {
            if (!targetObject[property] || targetObject[property].trim() === "") {
                return null;
            }

            // Check if the field property exists and is not null
            if (targetObject.hasOwnProperty(fieldType) && targetObject[fieldType] !== null) {
                return targetObject[fieldType];
            }

            const matchKeyword = (title, keywords) => {
                for (const keyword of keywords) {
                    if (title.toLowerCase().includes(keyword.toLowerCase())) {
                        return keyword;
                    }
                }
                return null;
            };

            for (const category of keywordsObject) {
                for (const subCategory in category) {
                    for (const item in category[subCategory]) {
                        const keywords = category[subCategory][item];
                        const matchedKeyword = matchKeyword(targetObject[property], keywords);

                        if (matchedKeyword) {
                            switch (fieldType) {
                                case 'h1':
                                case 'h3':
                                    return subCategory; // Return the sub-category
                                case 'h4':
                                    return item; // Return the item as a string
                            }
                        }
                    }
                }
            }

            return null;
        };

        // First, try to match using pageURL
        let result = checkAndMatch('pageURL');
        
        // If no match found with pageURL, try with link
        if (result === null) {
            result = checkAndMatch('link');
        }

        return result;
    }
`;

export default setUnifiedFieldsByPageURLAndLink;