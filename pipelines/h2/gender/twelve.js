const stage = {
    $addFields: {
        h2: {
            $cond: {
                if: {
                    $and: [
                        { $eq: ["$h2", "unknown"] },
                        { $not: { $in: ["$pageUrl", ["https://farawayclothing.com/collections/kids-all", "https://farawayclothing.com/collections/men-collection"]] } },
                        { $regexMatch: { input: "$pageUrl", regex: "^https://farawayclothing\\.com/" } }
                    ]
                },
                then: "Kadın",
                else: "$h2"
            }
        }
    }
}

export default stage