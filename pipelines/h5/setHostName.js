const stage = {
    $addFields: {
        h5: {
            $let: {
                vars: {
                    parsedUrl: {
                        $regexFind: {
                            input: "$link",
                            regex: "https?://([^/]+)"
                        }
                    }
                },
                in: {
                    $arrayElemAt: ["$$parsedUrl.captures", 0]
                }
            }
        }
    }
}


export default stage