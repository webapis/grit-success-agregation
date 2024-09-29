import fs from 'fs';

// Load gender keywords from JSON file
const genderKeywords = JSON.parse(fs.readFileSync(`${process.cwd()}/pipelines/h2/gender_keywords.json`, 'utf8'));

const buildPipeline = (genderKeywords) => {
    let conditions = [];

    // Loop through each gender (kadın, erkek, unisex, etc.)
    for (const [gender, keywords] of Object.entries(genderKeywords)) {
        let regexConditions = [];

        // Build $regexMatch conditions for each keyword (applies to both 'title' and 'link')
        keywords.forEach(keyword => {
            regexConditions.push({ "$regexMatch": { "input": "$title", "regex": keyword, "options": "i" } });
            regexConditions.push({ "$regexMatch": { "input": "$link", "regex": keyword, "options": "i" } });
        });

        // Add condition for the gender based on the keywords
        conditions.push({
            "case": { "$or": regexConditions },
            "then": gender
        });
    }

    // Add a default case when none of the keywords match
    conditions.push({
        "case": true,  // Default case when no pattern matches
        "then": "unknown"
    });

    // Build the pipeline stage
    return [
        {
            "$match": {
                "$or": [
                    { "h2": "unknown" }, // Only process documents where 'h2' is 'unknown'
                    { "h2": { "$ne": "unknown" } } // Pass other documents without processing
                ]
            }
        },
        {
            "$addFields": {
                "h2": {
                    "$switch": {
                        "branches": conditions,
                        "default": "unknown"  // Default value if no conditions match
                    }
                }
            }
        }
    ];
};

// Build the pipeline using gender keywords
const pipeline = buildPipeline(genderKeywords);

export default pipeline;
