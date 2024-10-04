import metaData from '../../meta-data/h1.js';

function pipeline({ giyim, yasam, taki, kozmetik, h }) {
    const h1 = metaData({ giyim, yasam, taki, kozmetik });

    const keywordConditions = Object.keys(h1).map(group => ({
        case: {
            $or: h1[group].map(keyword => {
                console.log('group', group);
                // Use $regexMatch with word boundaries for exact word/phrase match, case-insensitive
                return {
                    $regexMatch: { 
                        input: "$title", 
                        regex: `\\b${keyword.trim().replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}\\b`, 
                        options: "i" 
                    }
                };
            })
        },
        then: group
    }));

    const stage = {
        $addFields: {
            [h]: {
                $switch: {
                    branches: keywordConditions,
                    default: "unknown"
                }
            },
        }
    };

    return stage;
}

export default pipeline;