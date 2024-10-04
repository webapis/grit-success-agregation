import getJsonDataFromFolder from '../../utils/file/getJsonDataFromFolder.mjs'


const data =await getJsonDataFromFolder('meta-data/product-keywords')
const data2=[...data.map(m=>m[0])]

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
debugger

function categorizeByTitleLinkPageUrl({catid}){

    const obj = data[catid][0]



return [
    {
      $addFields: {
        combinedText: {
          $concat: [
            { $ifNull: ["$title", ""] },
            { $ifNull: ["$link", ""] },
            { $ifNull: ["$pageUrl", ""] }
          ]
        }
      }
    },
    {
      $addFields: {
        categoryMatch: {
          $reduce: {
            input: {
              $objectToArray: obj
            },
            initialValue: { category: "diğer", matched: false },
            in: {
              $cond: {
                if: {
                  $and: [
                    { $eq: ["$$value.matched", false] },
                    {
                      $anyElementTrue: {
                        $map: {
                          input: "$$this.v",
                          as: "keyword",
                          in: { $regexMatch: { input: "$combinedText", regex: { $concat: ["(?i)", "$$keyword"] } } }
                        }
                      }
                    }
                  ]
                },
                then: { category: "$$this.k", matched: true },
                else: "$$value"
              }
            }
          }
        }
      }
    },
    {
      $addFields: {
        h3: {
          $cond: {
            if: { $or: [{ $eq: ["$h3", "diğer"] }, { $not: ["$h3"] }] },
            then: "$categoryMatch.category",
            else: "$h3"
          }
        }
      }
    },
    {
      $project: {
        combinedText: 0,
        categoryMatch: 0
      }
    }
  ]
}


const stage ={
  $addFields: {
    h3: {
      $let: {
        vars: {
          productCategories: {
            $literal: [
              mergedObject
            ]
          }
        },
        in: {
          $reduce: {
            input: "$$productCategories",
            initialValue: null,
            in: {
              $cond: {
                if: { $eq: ["$$value", null] },
                then: {
                  $reduce: {
                    input: { $objectToArray: "$$this" },
                    initialValue: null,
                    in: {
                      $cond: {
                        if: {
                          $anyElementTrue: {
                            $map: {
                              input: "$$this.v",
                              as: "keyword",
                              in: {
                                $cond: {
                                  if: { $isArray: "$$keyword" },
                                  then: {
                                    $anyElementTrue: {
                                      $map: {
                                        input: "$$keyword",
                                        as: "subKeyword",
                                        in: { $regexMatch: { input: "$h4", regex: { $concat: ["\\b", "$$subKeyword", "\\b"] }, options: "i" } }
                                      }
                                    }
                                  },
                                  else: { $regexMatch: { input: "$h4", regex: { $concat: ["\\b", "$$keyword", "\\b"] }, options: "i" } }
                                }
                              }
                            }
                          }
                        },
                        then: "$$this.k",
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
  }
}

export default stage