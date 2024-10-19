const stage = {
    $addFields: {
        h2: {
            $cond: {
                if: {
                    $and: [
                        { $eq: ["$h2", "unknown"] },
                        { $not: { $in: ["$pageURL", ["https://farawayclothing.com/collections/kids-all", "https://farawayclothing.com/collections/men-collection"]] } },
                        { $regexMatch: { input: "$pageURL", regex: "^https://farawayclothing\\.com/" } }
                    ]
                },
                then: "Kadın",
                else: "$h2"
            }
        }
    }
}

export default stage