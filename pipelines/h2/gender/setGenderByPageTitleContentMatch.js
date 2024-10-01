let dynamicConditions = {
    kadın: [
        { pageTitleWords: ["Dahlia Bianca", "Kadın"] },
        { pageTitleWords: ["Faraway", "Abundant Dreams"] },
        { pageTitleWords: ["Faraway", "Jewellery"] },
        { pageTitleWords: ["Faraway", "Women"] },
        { pageTitleWords: ["Yargıcı", "Kadın"] }
    ],
    erkek: [
        { pageTitleWords: ["Avva", "Erkek"] }
    ]
}
let pipeline = [];

Object.keys(dynamicConditions).forEach(category => {
    dynamicConditions[category].forEach(condition => {
        pipeline.push({
            $set: {
                h2: {
                    $cond: {
                        if: {
                            $and: [
                                { $eq: ["$h2", "unknown"] },
                                {
                                    $allElementsTrue: {
                                        $map: {
                                            input: condition.pageTitleWords,
                                            as: "word",
                                            in: { $regexMatch: { input: "$pageTitle", regex: "$$word", options: "i" } }
                                        }
                                    }
                                }
                            ]
                        },
                        then: category,
                        else: "$h2"
                    }
                }
            }
        });
    });
});

export default pipeline;

/*
let dynamicConditions = {
    kadın: [
        { pageTitleWords: ["Dahlia Bianca", "Kadın"], titleWord: ['Etek', 'Kimon','Kemer'] }
    ],
    erkek: [
        { pageTitleWords: ["Avva", "Erkek"], titleWord: ['Kravat'] }
    ]
};

let pipeline = [];

Object.keys(dynamicConditions).forEach(category => {
    dynamicConditions[category].forEach(condition => {
        pipeline.push({
            $set: {
                h2: {
                    $cond: {
                        if: {
                            $and: [
                                { $eq: ["$h2", "unknown"] },
                                {
                                    $allElementsTrue: {
                                        $map: {
                                            input: condition.pageTitleWords,
                                            as: "word",
                                            in: { $regexMatch: { input: "$pageTitle", regex: "$$word", options: "i" } }
                                        }
                                    }
                                },
                                {
                                    $or: condition.titleWord.map(word => ({ $regexMatch: { input: "$title", regex: word, options: "i" } }))
                                }
                            ]
                        },
                        then: category,
                        else: "$h2"
                    }
                }
            }
        });
    });
});


export default pipeline

*/