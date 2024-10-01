import fs from 'fs';

// Load gender keywords from JSON file
const mappings = JSON.parse(fs.readFileSync(`${process.cwd()}/pipelines/h2/gender/_h2Value.json`, 'utf8'));


// Convert mappings into an array of cases
const switchCases = [];
for (const [h2Value, conditions] of Object.entries(mappings)) {
    conditions.forEach(condition => {
        switchCases.push({
            case: {
                $and: [
                    { $regexMatch: { input: "$link", regex: condition.link } },
                    { $regexMatch: { input: "$title", regex: condition.title, options: 'i' } }
                ]
            },
            then: h2Value // Set h2 to the key representing the value
        });
    });
}

// Add a default case to retain the current h2 value
switchCases.push({
    case: true, // default case
    then: "$h2"
});

const stages=[
    {
        "$match": {
            "$or": [
                { "h2": "unknown" }, // Only process documents where 'h2' is 'unknown'
                { "h2": { "$ne": "unknown" } } // Pass other documents without processing
            ]
        }
    },
    {
        $addFields: {
            h2: {
                $switch: {
                    branches: switchCases,
                    default: "$h2" // Keep existing value if no cases matched
                }
            }
        }
    }
]


export default stages