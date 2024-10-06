

function assignKeywordToTarget(targetObject, keywordsObject) {
    // Check if the title is empty; if yes, return the object as is
    if (!targetObject.title || targetObject.title.trim() === "") {
        return targetObject;
    }

    // Check if "h4" property already exists; if yes, return the object as is
    if (targetObject.hasOwnProperty('h4')) {
        return targetObject;
    }

    // Helper function to search for a keyword match in the title
    const matchKeyword = (title, keywords) => {
        for (const keyword of keywords) {
            if (title.toLowerCase().includes(keyword.toLowerCase())) {
                return keyword;
            }
        }
        return null;
    };

    // Iterate over the keywordsObject
    for (const category of keywordsObject) {
        for (const subCategory in category) {
            for (const item in category[subCategory]) {
                const keywords = category[subCategory][item];
                const matchedKeyword = matchKeyword(targetObject.title, keywords);
                
                // If a match is found, assign it to the h4 property and return the updated object
                if (matchedKeyword) {
                    targetObject.h4 = item;
                    return targetObject;
                }
            }
        }
    }

    // If no match is found, return the target object unchanged
    return targetObject;
}


//can we convert this function to equivalent mongodb aggregation pipeline stage