
import getJsonDataFromFolder from '../../utils/file/getJsonDataFromFolder.mjs'


const data = await getJsonDataFromFolder('meta-data/product-keywords')

function setH4ByTitleLink({ catid }) {
    return [
        {
            $addFields: {
                productNames: {
                    $let: {
                        vars: {
                            productGroups: data[catid]
                        },
                        in: {
                            $reduce: {
                                input: { $objectToArray: { $arrayElemAt: ["$$productGroups", 0] } },
                                initialValue: { matchedGroup: null, matchedProduct: null },
                                in: {
                                    $let: {
                                        vars: {
                                            currentMatch: {
                                                $reduce: {
                                                    input: "$$this.v",
                                                    initialValue: { group: "$$this.k", product: null },
                                                    in: {
                                                        $cond: {
                                                            if: { $eq: ["$$value.product", null] },
                                                            then: {
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
                                                                            $cond: {
                                                                                if: { $isArray: "$$this" },
                                                                                then: {
                                                                                    $filter: {
                                                                                        input: "$$this",
                                                                                        as: "variant",
                                                                                        cond: {
                                                                                            $or: [
                                                                                                { $regexMatch: { input: "$title", regex: { $concat: ["(?i)", "$$variant"] } } },
                                                                                                { $regexMatch: { input: "$link", regex: { $concat: ["(?i)", "$$variant"] } } }
                                                                                            ]
                                                                                        }
                                                                                    }
                                                                                },
                                                                                else: {
                                                                                    $filter: {
                                                                                        input: ["$$this"],
                                                                                        as: "variant",
                                                                                        cond: {
                                                                                            $or: [
                                                                                                { $regexMatch: { input: "$title", regex: { $concat: ["(?i)", "$$variant"] } } },
                                                                                                { $regexMatch: { input: "$link", regex: { $concat: ["(?i)", "$$variant"] } } }
                                                                                            ]
                                                                                        }
                                                                                    }
                                                                                }
                                                                            }
                                                                        }
                                                                    },
                                                                    in: {
                                                                        $cond: {
                                                                            if: { $gt: [{ $size: "$$matches" }, 0] },
                                                                            then: { group: "$$value.group", product: "$$productName" },
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
                                        },
                                        in: {
                                            $cond: {
                                                if: { $and: [{ $eq: ["$$value.matchedProduct", null] }, { $ne: ["$$currentMatch.product", null] }] },
                                                then: { matchedGroup: "$$currentMatch.group", matchedProduct: "$$currentMatch.product" },
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
                h4: "$productNames.matchedProduct"
            }
        },
        {
            $project: {
                productNames: 0
            }
        }
    ]
}
debugger

export default setH4ByTitleLink;