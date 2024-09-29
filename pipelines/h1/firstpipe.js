import h1 from '../../meta-data/h1.js'; // Assuming h1 is still needed for the pipeline logic

// Create the pipeline and export it

// Build $switch conditions dynamically using h1 keywords from external file
const keywordConditions = Object.keys(h1).map(group => ({
    case: {
        $or: h1[group].map(keyword => {
            console.log('group',group)
            // Use $regexMatch with 'i' option to handle case-insensitive matches
            return {
                $regexMatch: { input: "$title", regex: keyword.trim(), options: "i" }
            };
        })
    },
    then: group
}));

// Define the pipeline array
const pipeline = 
    {
        $addFields: {
            h1: {
                $switch: {
                    branches: keywordConditions,
                    default: "diğer" // Default value if no match is found
                }
            }
        }
    }



export default pipeline

