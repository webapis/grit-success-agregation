import fs from 'fs';

function setH4ByTitle({ id }) {
    const keywordsObject = JSON.parse(fs.readFileSync(`${process.cwd()}/meta-data/product-keywords-wrapped/productnames-${id}.json`));

    return {
        $addFields: {
            h4: {
                $function: {
                    body: `
                        function(targetObject, keywordsObject) {
                            if (!targetObject.title || targetObject.title.trim() === "") {
                                return null;
                            }

                            // Check if h4 property exists and is not null
                            if (targetObject.hasOwnProperty('h4') && targetObject.h4 !== null) {
                                return targetObject.h4;
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
                                        const matchedKeyword = matchKeyword(targetObject.title, keywords);

                                        if (matchedKeyword) {
                                            return item; // Return the item as a string
                                        }
                                    }
                                }
                            }

                            return null;
                        }
                    `,
                    args: ["$$ROOT", keywordsObject],
                    lang: "js"
                }
            }
        }
    }
}

export default setH4ByTitle;