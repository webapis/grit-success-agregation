import h1 from '../../meta-data/h1.js'; // Assuming h1 is still needed for the pipeline logic

// Build $switch conditions dynamically using h1 keywords from external file
const keywordConditions = Object.keys(h1).map(group => ({
    case: {
        $or: h1[group].map(keyword => {
            // Use $regexMatch with '$' to match keywords only at the end of the 'title' field
            return {
                $regexMatch: { 
                    input: "$title", 
                    regex: `${keyword.trim()}`,  // Add '$' to ensure the keyword is at the end of the string
                    options: "i"  // 'i' for case-insensitive matching
                }
            };
        })
    },
    then: group
}));

// Define the pipeline to update 'h1' only if its current value is "diğer"
const pipeline = {
    $addFields: {
        h1: {
            $cond: {
                if: { $eq: ["$h1", "diğer"] },  // Check if the current value of 'h1' is "diğer"
                then: {
                    $switch: {
                        branches: keywordConditions,  // Apply the dynamic switch for new keyword-based value
                        default: "diğer"  // Default value if no match is found
                    }
                },
                else: "$h1"  // Keep the existing value of 'h1' if it's not "diğer"
            }
        }
    }
};

export default pipeline;
