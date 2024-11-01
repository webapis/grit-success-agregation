const genderValues = {
  erkek: ["https://www.baysapkaci.com.tr/sal-sapka-takim",
    "https://www.mudo.com.tr/refined-koleksiyonu/?category_ids=2", "https://www.mudo.com.tr/gunluk-spor/"],
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
    "https://www.yargici.com/pe-bermuda-sort",
    "https://www.yargici.com/outlet-elbise",
    "https://www.yargici.com/outlet-etek",
    "https://www.yargici.com/outlet-hirka",
    "https://www.yargici.com/indirimli-parti-kiyafetleri",
    "https://www.yargici.com/outlet-dis-giyim",
    "https://www.yargici.com/outlet-canta",
    "https://www.yargici.com/indirim",
    "https://www.yargici.com/outlet-aksesuar",
    "https://www.yargici.com/sapka-bere",
    "https://www.yargici.com/outlet-aksesuar-kemer",
    "https://www.yargici.com/kolye",
    "https://www.yargici.com/yuzuk",
    "https://www.yargici.com/bileklik",
    "https://www.yargici.com/bros",
    "https://www.yargici.com/sac-aksesuari",
    "https://www.network.com.tr/en/newly-added-1757"
  ],
  unisex: ["https://www.ilvi.com/en/accessories-shoe-care-products",
    "https://www.yargici.com/eldiven-2-2",
    "https://www.yargici.com/corap",
    "https://www.network.com.tr/network-outlet-930"

  //   "https://www.network.com.tr/outlet-canta-1807",
  //   "https://www.network.com.tr/en/outlet-bag-1807",
  //   "https://www.network.com.tr/en/outlet-belt-1823"
   ]
};

// MongoDB aggregation pipeline stage
const setGenderByPageUrl = {
  $set: {
    h2: {
      $cond: [
        {
          $and: [
            { $eq: ["$h2", null] },
            { $in: ["$pageURL", genderValues.erkek] }
          ]
        },
        "erkek",
        {
          $cond: [
            {
              $and: [
                { $eq: ["$h2", null] },
                { $in: ["$pageURL", genderValues.kadın] }
              ]
            },
            "kadın",
            {
              $cond: [
                {
                  $and: [
                    { $eq: ["$h2", null] },
                    { $in: ["$pageURL", genderValues.unisex] }
                  ]
                },
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
export default setGenderByPageUrl


