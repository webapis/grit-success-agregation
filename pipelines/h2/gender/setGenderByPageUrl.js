const genderValues = {
    erkek: ["https://www.baysapkaci.com.tr/sal-sapka-takim"],
    kadın: [
      "https://www.baysapkaci.com.tr/plaj-cantasi",
      "https://silkandcashmere.com/collections/sac-aksesuarlari",
      "https://silkandcashmere.com/collections/bere",
      "https://silkandcashmere.com/collections/aksesuar-yeni-gelenler",
      "https://www.baysapkaci.com.tr/tumu-c-0",
      "https://www.dahliabianca.com/yeni-gelenler-2",
      "https://www.dahliabianca.com/indirim",
      "https://www.yargici.com/beachworks-mayo-bikini",
      "https://www.yargici.com/beachworks-plaj-elbisesi",
      "https://www.yargici.com/beachworks-gomlek-bluz",
      "https://www.yargici.com/beachworks-sort-pantolon",
      "https://www.yargici.com/beachworks-plaj-cantasi",
      "https://www.yargici.com/beachworks-sapka",
      "https://www.yargici.com/beachworks-gunes-gozlugu-ipi",
      "https://www.yargici.com/beachworks-kolye",
      "https://www.yargici.com/beachworks-kupe",
      "https://www.dahliabianca.com/sonbahar-kis-23",
      "https://www.dahliabianca.com/spring-summer-22",
      "https://silkandcashmere.com/collections/goz-bandi",
      "https://silkandcashmere.com/collections/kurumsal-satis",
      "https://www.yargici.com/cuzdan-2-2",
      "https://www.yargici.com/sac-aksesuari-2",
      "https://www.yargici.com/corap-2",
      "https://www.yargici.com/pe-giyim",
      "https://www.yargici.com/pe-aksesuar",
      "https://www.yargici.com/pe-bermuda-sort"
    ],
    unisex: ["https://www.ilvi.com/en/accessories-shoe-care-products"]
  };
  
  // MongoDB aggregation pipeline stage
  const stage = {
    $set: {
      h2: {
        $cond: [
          { $and: [
            { $eq: ["$h2", "unknown"] },
            { $in: ["$pageUrl", genderValues.erkek] }
          ]},
          "erkek",
          {
            $cond: [
              { $and: [
                { $eq: ["$h2", "unknown"] },
                { $in: ["$pageUrl", genderValues.kadın] }
              ]},
              "kadın",
              {
                $cond: [
                  { $and: [
                    { $eq: ["$h2", "unknown"] },
                    { $in: ["$pageUrl", genderValues.unisex] }
                  ]},
                  "unisex",
                  "$h2" // Default to original value if no match
                ]
              }
            ]
          }
        ]
      }
    }
  };
export default stage


