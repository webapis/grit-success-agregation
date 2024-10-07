const replaceDotComma = [  {
    $addFields: {
        price: {
            $cond: {
                if: { $eq: [{ $type: "$price" }, "string"] }, // Check if price is a string
                then: { 
                    $replaceAll: { 
                        input: { $trim: { input: "$price" } }, // First, trim whitespace
                        find: " ", 
                        replacement: "" // Then, replace all spaces with an empty string
                    } 
                },
                else: "$price" // Keep original value if not a string
            }
        }
    }
},{
    
    $addFields: {
        price: {
            $cond: {
                if: {
                    $and: [
                        { $eq: [{ $type: "$price" }, "string"] }, // Ensure price is a string
                        {
                            $or: [
                                { $regexMatch: { input: "$price", regex: /^\d{2}[,]\d{2}$/ } },
                                { $regexMatch: { input: "$price", regex: /^\d{3}[,]\d{2}$/ } },
                                { $regexMatch: { input: "$price", regex: /^\d{4}[,]\d{2}$/ } },
                                { $regexMatch: { input: "$price", regex: /^\d{2}[,]\d$/ } },
                                { $regexMatch: { input: "$price", regex: /^\d{3}[,]\d$/ } },
                                { $regexMatch: { input: "$price", regex: /^\d{4}[,]\d$/ } }
                            ]
                        }
                    ]
                },
                then: { $replaceOne: { input: "$price", find: ",", replacement: "." } },
                else: "$price"
            }
        }
    }
},
{
    $addFields: {
        price: {
            $cond: {
                if: {
                    $and: [
                        { $eq: [{ $type: "$price" }, "string"] }, // Ensure price is a string
                        {
                            $or: [
                                { $regexMatch: { input: "$price", regex: /^\d{3}[.]\d{3}$/ } },
                                { $regexMatch: { input: "$price", regex: /^\d{2}[.]\d{3}$/ } },
                                { $regexMatch: { input: "$price", regex: /^\d{1}[.]\d{3}$/ } },
                                { $regexMatch: { input: "$price", regex: /^\d[.]\d{3}[,]\d{2}$/ } },
                            ]
                        }
                    ]
                },
                then: { $replaceOne: { input: "$price", find: ".", replacement: "" } },
                else: "$price"
            }
        }
    }
},
{
    $addFields: {
        price: {
            $cond: {
                if: {
                    $and: [
                        { $eq: [{ $type: "$price" }, "string"] }, // Ensure price is a string
                        {
                            $or: [
                                { $regexMatch: { input: "$price", regex: /^\d{1}[,]\d{3}$/ } },
                                { $regexMatch: { input: "$price", regex: /^\d{1}[,]\d{3}$/ } },
                                { $regexMatch: { input: "$price", regex: /^\d{1}[,]\d{3}[.]\d{2}$/ } },
                                { $regexMatch: { input: "$price", regex: /^\d{2}[,]\d{3}[.]\d{2}$/ } },
                                { $regexMatch: { input: "$price", regex: /^\d{2}[.]\d{3}[,]\d{2}$/ } },
                                { $regexMatch: { input: "$price", regex: /^\d{3}[.]\d{3}[,]\d{2}$/ } },
                            ]
                        }
                    ]
                },
                then: { $replaceOne: { input: "$price", find: ",", replacement: "" } },
                else: "$price"
            }
        }
    }
},
{
    $addFields: {
        price: {
            $cond: {
                if: {
                    $and: [
                        { $eq: [{ $type: "$price" }, "string"] }, // Ensure price is a string
                        {
                            $or: [

                                { $regexMatch: { input: "$price", regex: /^\d{2}[.]\d{3}[,]\d{2}$/ } },
                                { $regexMatch: { input: "$price", regex: /^\d{3}[.]\d{3}[,]\d{2}$/ } },
                            ]
                        }
                    ]
                },
                then: { $replaceOne: { input: "$price", find: ",", replacement: "." } },
                else: "$price"
            }
        }
    }
}
    ,
{
    $addFields: {
        price: {
            $cond: {
                if: {
                    $and: [
                        { $eq: [{ $type: "$price" }, "string"] }, // Ensure price is a string
                        {
                            $or: [

                                { $regexMatch: { input: "$price", regex: /^\d[.]\d{3}[,]\d{2}$/ } },

                            ]
                        }
                    ]
                },
                then: { $replaceOne: { input: "$price", find: ",", replacement: "." } },
                else: "$price"
            }
        }
    }
}
]

export default replaceDotComma