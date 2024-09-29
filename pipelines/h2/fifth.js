const stage = [
    {
        "$match": {
            "h2": "unknown"
        }
    },
    {
        "$addFields": {
            "h2": {
                "$switch": {
                    "branches": [
                        {
                            "case": {
                                "$or": [
                                    { "$regexMatch": { "input": "$title", "regex": "kadın", "options": "i" } },
                                    { "$regexMatch": { "input": "$title", "regex": "women", "options": "i" } }
                                ]
                            },
                            "then": "kadın"
                        },
                        {
                            "case": {
                                "$or": [
                                    { "$regexMatch": { "input": "$title", "regex": "erkek", "options": "i" } },
                                    { "$regexMatch": { "input": "$title", "regex": "men", "options": "i" } }
                                ]
                            },
                            "then": "erkek"
                        }
                    ],
                    "default": "unknown"
                }
            }
        }
    }
]

export default stage