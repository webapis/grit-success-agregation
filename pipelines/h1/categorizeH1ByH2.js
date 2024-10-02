const stage = {
    $addFields: {
        h1: {
            $cond: {
                if: {
                    $and: [
                        { $eq: ["$h1", "unknown"] },
                        { $in: ["$h2", ["kadın", "erkek","Kız Çocuk","çocuk","Kadın","unisex"]] }
                    ]
                },
                then: "giyim",
                else: "$h1"
            }
        }
    }
}

export default stage