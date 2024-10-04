import getJsonDataFromFolder from '../../utils/file/getJsonDataFromFolder.mjs'

const data = await getJsonDataFromFolder('meta-data/product-keywords')
const data2 = [...data.map(m => m[0])]

let mergedObject = {};

// Function to merge objects
data2.forEach(obj => {
    Object.keys(obj).forEach(key => {
        if (!mergedObject[key]) {
            mergedObject[key] = obj[key]; // Add new key
        } else {
            mergedObject[key] = mergedObject[key].concat(obj[key]); // Merge arrays
        }
    });
});

function setH4ByTitleLink({ catid }) {
    const obj = data2[catid]
    return [
        {
            $addFields: {
                productNames: {
                    $let: {
                        vars: {
                            productGroups: [obj]
                        },
                        in: {
                            $reduce: {
                                input: { $objectToArray: { $arrayElemAt: ["$$productGroups", 0] } },
                                initialValue: { matchedGroup: null, matchedProduct: null, matchLength: 0 },
                                in: {
                                    $let: {
                                        vars: {
                                            currentMatch: {
                                                $reduce: {
                                                    input: "$$this.v",
                                                    initialValue: { group: "$$this.k", product: null, matchLength: 0 },
                                                    in: {
                                                        $let: {
                                                            vars: {
                                                                productName: {
                                                                    $cond: {
                                                                        if: { $isArray: "$$this" },
                                                                        then: { $arrayElemAt: ["$$this", 0] },
                                                                        else: "$$this"
                                                                    }
                                                                },
                                                                matches: {
                                                                    $filter: {
                                                                        input: { $cond: { if: { $isArray: "$$this" }, then: "$$this", else: ["$$this"] } },
                                                                        as: "variant",
                                                                        cond: {
                                                                            $regexMatch: { 
                                                                                input: "$title", 
                                                                                regex: { $concat: ["(?i)\\b", "$$variant", "\\b"] } 
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            },
                                                            in: {
                                                                $cond: {
                                                                    if: { $gt: [{ $size: "$$matches" }, 0] },
                                                                    then: {
                                                                        $let: {
                                                                            vars: {
                                                                                longestMatch: {
                                                                                    $reduce: {
                                                                                        input: "$$matches",
                                                                                        initialValue: { match: "", length: 0 },
                                                                                        in: {
                                                                                            $cond: {
                                                                                                if: { $gt: [{ $strLenCP: "$$this" }, "$$value.length"] },
                                                                                                then: { match: "$$this", length: { $strLenCP: "$$this" } },
                                                                                                else: "$$value"
                                                                                            }
                                                                                        }
                                                                                    }
                                                                                }
                                                                            },
                                                                            in: {
                                                                                $cond: {
                                                                                    if: { $gt: ["$$longestMatch.length", "$$value.matchLength"] },
                                                                                    then: { group: "$$value.group", product: "$$productName", matchLength: "$$longestMatch.length" },
                                                                                    else: "$$value"
                                                                                }
                                                                            }
                                                                        }
                                                                    },
                                                                    else: "$$value"
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        },
                                        in: {
                                            $cond: {
                                                if: { $gt: ["$$currentMatch.matchLength", "$$value.matchLength"] },
                                                then: { matchedGroup: "$$currentMatch.group", matchedProduct: "$$currentMatch.product", matchLength: "$$currentMatch.matchLength" },
                                                else: "$$value"
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        {
            $addFields: {
                h4: {
                    $cond: {
                        if: { $and: [
                            { $or: [{ $eq: [{ $type: "$h4" }, "missing"] }, { $eq: ["$h4", "diğer"] }] },
                            { $ne: ["$productNames.matchedProduct", null] }
                        ]},
                        then: "$productNames.matchedProduct",
                        else: "$h4"
                    }
                }
            }
        },
        {
            $project: {
                productNames: 0
            }
        }
    ]
}

export default setH4ByTitleLink;