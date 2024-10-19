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