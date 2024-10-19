const stage = {
    $set: {
        h2: {
            $cond: {
                if: { $eq: ["$h2", "unknown"] },
                then: {
                    $switch: {
                        branches: [
                            {
                                case: { $regexMatch: { input: "$pageURL", regex: "erkek", options: "i" } },
                                then: "erkek"
                            },
                            {
                                case: { $regexMatch: { input: "$pageURL", regex: "kadin|kadin|woman|women|women's|Kad%C4%B1n", options: "i" } },
                                then: "kadın"
                            },
                            {
                                case: { $regexMatch: { input: "$pageURL", regex: "cocuk", options: "i" } },
                                then: "çocuk"
                            },
                            // Add more branches if needed
                        ],
                        default: "$h2"
                    }
                },
                else: "$h2"
            }
        }
    }
}

export default stage