const stage = {

    $set: {
        h2: {
            $cond: {
                if: { $eq: ["$h1", "ev ve yaşam"] },
                then: "ev&yaşam",
                else: "$h2"
            }
        }
    }
}

export default stage