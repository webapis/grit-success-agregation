import fs from 'fs';

// Load gender keywords from JSON file

const buildPipeline = (genderKeywords) => {
    let conditions = [];

    // Loop through each gender (kadın, erkek, unisex, etc.)
    for (const [gender, keywords] of Object.entries(genderKeywords)) {
        let regexConditions = [];

        // Build $regexMatch conditions for each keyword (applies to both 'title' and 'link')
        keywords.forEach(keyword => {

            regexConditions.push({ "$regexMatch": { "input": "$pageURL", "regex": keyword, "options": "i" } });
        });

        // Add condition for the gender based on the keywords
        conditions.push({
            "case": { "$or": regexConditions },
            "then": gender
        });
    }

    // Build the pipeline stage
    return [
        {
            "$addFields": {
                "h2": {
                    "$cond": {
                        "if": { "$eq": ["$h2", null] },
                        "then": {
                            "$switch": {
                                "branches": conditions,
                                "default": null
                            }
                        },
                        "else": "$h2"
                    }
                }
            }
        }
    ];
};

// Build the pipeline using gender keywords


function setGenderByPageURLContent({ id }) {

    const genderKeywords = JSON.parse(fs.readFileSync(`${process.cwd()}/pipelines/h2/gender/_gender_keywords-${id}.json`, 'utf8'));

    const pipeline = buildPipeline(genderKeywords);

    return pipeline
}
export default setGenderByPageURLContent;