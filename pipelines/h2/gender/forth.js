import fs from 'fs';

// Load regex patterns from JSON file
const regexPatterns = JSON.parse(fs.readFileSync(`${process.cwd()}/pipelines/h2/gender/url_patterns.json`, 'utf8'));

const buildPipeline = (patterns) => {
    let conditions = [];

    // Loop through each gender (kadın, erkek, unisex, etc.)
    for (const [gender, regexArray] of Object.entries(patterns)) {
        regexArray.forEach(regex => {
            conditions.push({
                "case": { "$regexMatch": { "input": "$link", "regex": regex } },  // Use "case" instead of "if"
                "then": gender
            });
        });
    }

    // Add a default case when none of the regex patterns match
    conditions.push({
        "case": true,  // Default case
        "then": "unknown"
    });

    return {
        "$addFields": {
            "h2": {
                "$switch": {
                    "branches": conditions
                }
            }
        }
    };
};

const pipeline = buildPipeline(regexPatterns);

export default pipeline;
