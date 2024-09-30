const stages = [
    
    {
        $addFields: {
          h2: {
            $cond: {
              if: {
                $and: [
                  { $eq: ["$h2", "unknown"] },
                  { $regexMatch: { input: "$pageUrl", regex: "cocuk", options: "i" } },
                  {
                    $or: [
                      { $regexMatch: { input: "$title", regex: "bikini", options: "i" } },
                      { $regexMatch: { input: "$title", regex: "mayo", options: "i" } }
                      // Add more keywords here as needed
                    ]
                  }
                ]
              },
              then: "kız çocuk",
              else: "$h2"
            }
          }
        }
      }
      
]

export default stages