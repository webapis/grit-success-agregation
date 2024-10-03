import getJsonDataFromFolder from '../../utils/file/getJsonDataFromFolder.mjs'


const data =await getJsonDataFromFolder('meta-data/product-keywords')
for(let d of data){
const current =d[0]
for(let c in current){
    let update =current[c].flat()

    current[c]=update
    
}
}

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
        h3: "$categoryMatch.category"
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


export default categorizeByTitleLinkPageUrl