let dynamicConditions = {
    kadın: [
        { pageUrl:"https://www.yargici.com",title:["Bikini","Mayo"] }
    ],
    erkek: [
        { pageUrl:"https://www.avva.com",title:["Boxer","Bere"] }
    ]
};


const stages = [
    {
      $addFields: {
        newH2: {
          $cond: {
            if: { $eq: ["$h2", "unknown"] },
            then: {
              $let: {
                vars: {
                  matchedCondition: {
                    $reduce: {
                      input: { $objectToArray: dynamicConditions },
                      initialValue: null,
                      in: {
                        $cond: [
                          { $ne: ["$$value", null] },
                          "$$value",
                          {
                            $reduce: {
                              input: "$$this.v",
                              initialValue: null,
                              in: {
                                $cond: [
                                  { $ne: ["$$value", null] },
                                  "$$value",
                                  {
                                    $cond: [
                                      {
                                        $and: [
                                          { $regexMatch: { input: "$pageUrl", regex: "$$this.pageUrl" } },
                                          {
                                            $reduce: {
                                              input: "$$this.title",
                                              initialValue: false,
                                              in: {
                                                $or: [
                                                  "$$value",
                                                  { $regexMatch: { input: "$title", regex: "$$this" } }
                                                ]
                                              }
                                            }
                                          }
                                        ]
                                      },
                                      "$$this.k",
                                      null
                                    ]
                                  }
                                ]
                              }
                            }
                          }
                        ]
                      }
                    }
                  }
                },
                in: {
                  $cond: [
                    { $ne: ["$$matchedCondition", null] },
                    "$$matchedCondition",
                    "$h2"
                  ]
                }
              }
            },
            else: "$h2"
          }
        }
      }
    },
    {
      $set: {
        h2: "$newH2"
      }
    },
    {
      $unset: "newH2"
    }
  ];


  export default stages