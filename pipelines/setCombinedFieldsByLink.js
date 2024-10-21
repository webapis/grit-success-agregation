import fs from 'fs';

function setCombinedFieldsByLink({ id }) {
    const keywordsObject = JSON.parse(fs.readFileSync(`${process.cwd()}/data/2.step-data/productnames-${id}.json`));

    return {
        $addFields: {
            h1: {
                $function: {
                    body: combinedFunction,
                    args: ["$$ROOT", keywordsObject, "h1"],
                    lang: "js"
                }
            },
            h3: {
                $function: {
                    body: combinedFunction,
                    args: ["$$ROOT", keywordsObject, "h3"],
                    lang: "js"
                }
            },
            h4: {
                $function: {
                    body: combinedFunction,
                    args: ["$$ROOT", keywordsObject, "h4"],
                    lang: "js"
                }
            }
        }
    };
}

const combinedFunction = `
    function(targetObject, keywordsObject, fieldType) {
        if (!targetObject.link || targetObject.link.trim() === "") {
            return null;
        }

        // Check if the property exists and is not null
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
                    const matchedKeyword = matchKeyword(targetObject.link, keywords);

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
    }
`;

export default setCombinedFieldsByLink;

//https://claude.ai/chat/83c13629-dee7-436d-9e16-f4d7c47590e0