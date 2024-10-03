// Function to check if a keyword matches
const keywordsJSON = [
    {
        "üst giyim": [
            [
                "elbise",
                "elibise",
                "ebise",
                "ELBİSE",
                "DRESS"
            ],
            [
                "gömlek",
                "shirt",
                "henry"
            ],
            [
                "tulum",
                "tuluım",
                "jumpsuit",
                "playsuit",
                "overall"
            ],
            [
                "kazak",
                "knit",
                "Vanilla 139429950001d3"
            ],
            [
                "hırka",
                "сardigan",
                "Cardigan"
            ],
            "süveter",
            "takım elbise",
            "SMOKİN",
            [
                "bluz",
                "blouse"
            ],
            "atlet",
            [
                "tunik",
                "tunic"
            ],
            "pareo",
            "tankini",
            "üst",
            [
                "kimono",
                "KİMONO"
            ],
            [
                "büstiyer",
                "BÜSTİYER",
                "BUSTİYER",
                "bustier"
            ],
            [
                "сrop",
                "Crop"
            ],
            "body",
            "pelerin",
            "bolero",
            "kaftan",
            "top",
            "triko",
            "panço",
            "polo",
            [
                "tişört",
                "tshirt",
                "tişört",
                "tsihrt",
                "t-Shirt"
            ],
            [
                "SWEAT"
            ],
            "HOODIE",
            "kap$",
            "kurdele",
            "abiye$"
        ],
        "alt giyim": [
            [
                "pantolon",
                "mom jean",
                "pants",
                "TROUSER",
                "palazzo",
                "paça",
                "Wide-Leg Jean",
                "pantalon",
                "Straight Fit Jean",
                "pant",
                "yüksek bel",
                "high-waist jeans",
               
            ],
            [
                "şort",
                "short"
            ],
            [
                "tayt",
                "leggings",
                "Legging"
            ],
            [
                "etek",
                "skirt"
            ],
            "bermuda",
            "alt$",
            "Jogger$",
            [
                "loungwear altı",
                "loungewear altı"
            ],
            [
                "eşofman"
            ],
            [
                "kapri",
                "capris"
            ]
        ],
        "dış giyim": [
            [
                "сeket",
                "Ceket",
                "blazer",
                "jacket"
            ],
            "mont",
            [
                "kaban",
                "coat"
            ],
            "palto",
            [
                "yelek",
                "vest"
            ],
            [
                "trençkot",
                "TRENCH",
                "TRENCKOT",
                "TRENC COAT"
            ],
            "bomber",
            "pardösü",
            [
                "yağmurluk",
                "yağmurluğu"
            ],
            "kürk$",
            "manto"
        ],
        "çanta": [
            [
                "çanta",
                "bag"
            ],
            "Çanta",
            [
                "bavul",
                "suitcase"
            ],
            [
                "сüzdan",
                "Cüzdan",
                "wallet"
            ],
            [
                "kartlık",
                "card holder"
            ],
            "torba",
            "portföy",
            [
                "сlucth",
                "Clucth",
                "Clutch"
            ],
            "travel organızer",
            "valiz",
            "anahtarlık",
            "pasaport kılıfı",
            [
                "telefon Kılıfı",
                "phone case"
            ]
        ],
        "ayakkabı": [
            [
                "topuklu",
                "pump"
            ],
            "babet",
            "sandalet",
            "çizme",
            [
                "terlik",
                "slippers",
                "slide",
                "slipper"
            ],
            [
                "stiletto",
                "sitiletto"
            ],
            "platform ayakkabı",
            "sneaker",
            [
                "bot$",
                "boot"
            ],
            "espadril",
            "espardenya",
            "loafer",
            "kar Botu",
            "yağmur botu",
            [
                "makosen",
                "moccasin"
            ],
            [
                "ayakkabı",
                "Shoe"
            ],
            [
                "ballerin",
                "ballerina"
            ]
        ],
        "başlık": [
            [
                "şapka",
                "Şapka",
                "hat$"
            ],
            "bere",
            "kasket",
            "Kulak Isıtıcı"
        ],
        "atkı": [
            "fular",
            "eşarp",
            "bandana",
            "boyunluk",
            [

                "shawl"
            ],
            [
                "atkı",
                "scarf",
                "foulard"
            ],
            "kaşkol"
        ],
        "aksesuar": [
            [
                "kemer$",
                "belt",
                "kemeri$"
            ],
            "kravat",
            "papyon",
            "boyun aksesuarı",
            "omuz aksesuarı",
            "omuzluk",
            [
                "çorap",
                "socks",
                "çorabı"
            ],
            "yelpaze",
            [
                "eldiven",
                "gloves"
            ],
            "mendil",
            "küçük şemsiye",
            "maske$",
            "KOL DÜĞMESİ",
            "keychain"
        ],
        "aksesuar-saç": [
            "toka seti",
            [
                "saç bandı",
                "headband"
            ],
            "saç tacı",
            [
                "saç kravat",
                "hair tie"
            ],
            [
                "toka$",
                "hair buckle"
            ],
            "saç aksesuarı"
        ],
        "saat": [
            "saat"
        ],
        "gözlük": [
            "gözlük",
            [
                "gözlük kılıfı",
                "gözlık kılıfı"
            ],
            ["güneş gözlüğü", "Güneş Gözlüğü"],

            "göz Bandı"
        ],
        "plaj, havuz": [
            [
                "bikini",
                "bkini"
            ],
            [
                "mayo",
                "swimsuit"
            ],
            "havuz bonesi",
            "yüzücü bonesi",
            "kulak tıkacı",
            "burun tıkacı",
            [
                "plaj havlusu",
                "beach towel"
            ],
            [
                "peştemal",
                "peştemâli",
                "sarong"
            ]
        ],
        "ev": [
            [
                "pijama",
                "pjama"
            ],
            "gecelik",
            "sabahlık",
            "babydoll",
            "tee-jama"
        ],
        "gelinlik": [
            "GELİNLİK"
        ],
        "anne": [
            "emzirme sütyeni",
            "hamile"
        ],
        "iç giyim": [
            "sütyen",
            "külot",
            "bralet",
            "jartiyer çorabı",
            "push-Up takım",
            "bel korse",
            "boxer",
            "korse$",
            "tanga",
            "teddy",
            "thong",
            "slip$",
            "brazillian",
            "jartiyer",
            "İç Giyim",
            "hipster"
        ]
    }
]






// Assuming the keywords are loaded into a variable called 'keywords'
const keywordsObject = keywordsJSON[0]; // Since the keywords are in an array with a single object



const stage = [
  {
    $addFields: {
      h3: {
        $let: {
          vars: {
            matchedCategory: {
              $reduce: {
                input: { $objectToArray: keywordsObject },
                initialValue: null,
                in: {
                  $cond: [
                    {
                      $or: [
                        { $ne: ["$$value", null] },
                        {
                          $anyElementTrue: {
                            $map: {
                              input: "$$this.v",
                              as: "keyword",
                              in: {
                                $cond: [
                                  { $isArray: "$$keyword" },
                                  {
                                    $anyElementTrue: {
                                      $map: {
                                        input: "$$keyword",
                                        as: "subKeyword",
                                        in: {
                                          $or: [
                                            { $regexMatch: { input: "$title", regex: "$$subKeyword", options: "i" } },
                                            { $regexMatch: { input: "$link", regex: "$$subKeyword", options: "i" } },
                                            { $regexMatch: { input: "$pageUrl", regex: "$$subKeyword", options: "i" } }
                                          ]
                                        }
                                      }
                                    }
                                  },
                                  {
                                    $or: [
                                      { $regexMatch: { input: "$title", regex: "$$keyword", options: "i" } },
                                      { $regexMatch: { input: "$link", regex: "$$keyword", options: "i" } },
                                      { $regexMatch: { input: "$pageUrl", regex: "$$keyword", options: "i" } }
                                    ]
                                  }
                                ]
                              }
                            }
                          }
                        }
                      ]
                    },
                    "$$value",
                    "$$this.k"
                  ]
                }
              }
            }
          },
          in: { $ifNull: ["$$matchedCategory", "unknown"] }
        }
      },
      h4: {
        $let: {
          vars: {
            matchedKeyword: {
              $reduce: {
                input: { $objectToArray: keywordsObject },
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
                                { $isArray: "$$this" },
                                {
                                  $let: {
                                    vars: {
                                      matchFound: {
                                        $anyElementTrue: {
                                          $map: {
                                            input: "$$this",
                                            as: "subKeyword",
                                            in: {
                                              $or: [
                                                { $regexMatch: { input: "$title", regex: "$$subKeyword", options: "i" } },
                                                { $regexMatch: { input: "$link", regex: "$$subKeyword", options: "i" } },
                                                { $regexMatch: { input: "$pageUrl", regex: "$$subKeyword", options: "i" } }
                                              ]
                                            }
                                          }
                                        }
                                      }
                                    },
                                    in: {
                                      $cond: [
                                        "$$matchFound",
                                        { $arrayElemAt: ["$$this", 0] },
                                        null
                                      ]
                                    }
                                  }
                                },
                                {
                                  $cond: [
                                    {
                                      $or: [
                                        { $regexMatch: { input: "$title", regex: "$$this", options: "i" } },
                                        { $regexMatch: { input: "$link", regex: "$$this", options: "i" } },
                                        { $regexMatch: { input: "$pageUrl", regex: "$$this", options: "i" } }
                                      ]
                                    },
                                    "$$this",
                                    null
                                  ]
                                }
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
          in: { $ifNull: ["$$matchedKeyword", "unknown"] }
        }
      }
    }
  }
];


export default stage