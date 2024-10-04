
import getJsonDataFromFolder from '../../utils/file/getJsonDataFromFolder.mjs'


const data = await getJsonDataFromFolder('meta-data/product-keywords')

function setH4ByTitleLink({ catid }) {
    return [
        {
          $addFields: {
            productNames: {
              $let: {
                vars: {
                  productGroups: [
                    {
                      "üst giyim": [
                        ["elbise", "elibise", "ebise", "ELBİSE", "DRESS"],
                        ["gömlek", "shirt", "henry"],
                        ["tulum", "tuluım", "jumpsuit", "playsuit", "overall"],
                        ["kazak", "knit", "Vanilla 139429950001d3"],
                        ["hırka", "сardigan", "Cardigan"],
                        "süveter", "takım elbise", "SMOKİN",
                        ["bluz", "blouse"],
                        "atlet",
                        ["tunik", "tunic"],
                        "pareo", "tankini", "üst",
                        ["kimono", "KİMONO"],
                        ["büstiyer", "BÜSTİYER", "BUSTİYER", "bustier"],
                        ["сrop", "Crop"],
                        "body", "pelerin", "bolero", "kaftan", "top", "triko", "panço", "polo",
                        ["tişört", "tshirt", "tişört", "tsihrt", "t-Shirt"],
                        ["SWEAT"],
                        "HOODIE", "kap$", "kurdele", "abiye$"
                      ],
                      "alt giyim": [
                        ["pantolon", "mom jean", "pants", "TROUSER", "palazzo", "paça", "Wide-Leg Jean", "pantalon", "Straight Fit Jean", "pant", "yüksek bel", "high-waist jeans"],
                        ["şort", "short"],
                        ["tayt", "leggings", "Legging"],
                        ["etek", "skirt"],
                        "bermuda", "alt$", "Jogger$",
                        ["loungwear altı", "loungewear altı"],
                        ["eşofman"],
                        ["kapri", "capris"]
                      ],
                      "dış giyim": [
                        ["сeket", "Ceket", "blazer", "jacket"],
                        "mont",
                        ["kaban", "coat"],
                        "palto",
                        ["yelek", "vest"],
                        ["trençkot", "TRENCH", "TRENCKOT", "TRENC COAT"],
                        "bomber", "pardösü",
                        ["yağmurluk", "yağmurluğu"],
                        "kürk$", "manto"
                      ],
                      "çanta": [
                        ["çanta", "bag"],
                        "Çanta",
                        ["bavul", "suitcase"],
                        ["сüzdan", "Cüzdan", "wallet"],
                        ["kartlık", "card holder"],
                        "torba", "portföy",
                        ["сlucth", "Clucth", "Clutch"],
                        "travel organızer", "valiz", "anahtarlık", "pasaport kılıfı",
                        ["telefon Kılıfı", "phone case"]
                      ],
                      "ayakkabı": [
                        ["topuklu", "pump"],
                        "babet", "sandalet", "çizme",
                        ["terlik", "slippers", "slide", "slipper"],
                        ["stiletto", "sitiletto"],
                        "platform ayakkabı", "sneaker",
                        ["bot$", "boot"],
                        "espadril", "espardenya", "loafer", "kar Botu", "yağmur botu",
                        ["makosen", "moccasin"],
                        ["ayakkabı", "Shoe"],
                        ["ballerin", "ballerina"]
                      ],
                      "başlık": [
                        ["şapka", "Şapka", "hat$"],
                        "bere", "kasket", "Kulak Isıtıcı"
                      ],
                      "atkı": [
                        "fular", "eşarp", "bandana", "boyunluk",
                        ["shawl"],
                        ["atkı", "scarf", "foulard"],
                        "kaşkol"
                      ],
                      "aksesuar": [
                        ["kemer$", "belt", "kemeri$"],
                        "kravat", "papyon", "boyun aksesuarı", "omuz aksesuarı", "omuzluk",
                        ["çorap", "socks", "çorabı"],
                        "yelpaze",
                        ["eldiven", "gloves"],
                        "mendil", "küçük şemsiye", "maske$", "KOL DÜĞMESİ", "keychain"
                      ],
                      "aksesuar-saç": [
                        "toka seti",
                        ["saç bandı", "headband"],
                        "saç tacı",
                        ["saç kravat", "hair tie"],
                        ["toka$", "hair buckle"],
                        "saç aksesuarı"
                      ],
                      "saat": ["saat"],
                      "gözlük": [
                        "gözlük",
                        ["gözlük kılıfı", "gözlık kılıfı"],
                        ["güneş gözlüğü", "Güneş Gözlüğü"],
                        "göz Bandı"
                      ],
                      "plaj, havuz": [
                        ["bikini", "bkini"],
                        ["mayo", "swimsuit"],
                        "havuz bonesi", "yüzücü bonesi", "kulak tıkacı", "burun tıkacı",
                        ["plaj havlusu", "beach towel"],
                        ["peştemal", "peştemâli", "sarong"]
                      ],
                      "ev": [
                        ["pijama", "pjama"],
                        "gecelik", "sabahlık", "babydoll", "tee-jama"
                      ],
                      "gelinlik": ["GELİNLİK"],
                      "anne": ["emzirme sütyeni", "hamile"],
                      "iç giyim": [
                        "sütyen", "külot", "bralet", "jartiyer çorabı", "push-Up takım",
                        "bel korse", "boxer", "korse$", "tanga", "teddy", "thong", "slip$",
                        "brazillian", "jartiyer", "İç Giyim", "hipster"
                      ],
                      "depolama": ["katlanabilir kasa", "kutu"],
                      "mobilya": [
                        "koltuk", "dolap", "sandalye", "sehpa", "bank", "kitaplık", "gazetelik",
                        "tabure", "minder", "çekmece kulbu", "konsol", "puf", "masa",
                        ["yatak başlığı", "yatak başı"],
                        "paravan", "dresuar", "salıncak"
                      ],
                      "mobilya-bahçe": ["şezlong"],
                      "dekorasyon": [
                        "küp", "süs", "duvar dekor", ["obje"], "şömine", "ayna", "vazo", "tablo",
                        "sepet", "Dekoratif Bitki", "çerçeve", "saksı", "yılbaşı ağacı", "askı"
                      ],
                      "aydınlatma": [
                        "aydınlatma", "fener", "abajur", "şamdan", "mumluk",
                        ["pilli mum", "mum"],
                        "lambader", "masa lambası"
                      ],
                      "sofra": [
                        "supla", "amerikan servis", "tabak", "yemek bıçağı", "yemek kaşığı",
                        "yemek çatalı", "tatlı kaşığı", "tatlı bıçağı", "tatlı çatalı", "kase",
                        "peçete halkası", "kumaş peçete", "bardak altlığı", "bardak",
                        "servis – sunum gereçleri", "fincan", "servis tahtası", "servis tabağı",
                        "sürahi", "tepsi", "açacak", "şarap kadehi", "demlik"
                      ],
                      "ev tekstil": [
                        "battaniye", "yastık", "mutfak önlüğü", "halı", "kilim", "runner",
                        ["nevresim takımı", "nevresim seti"]
                      ],
                      "ofis, kırtasiye": ["dosyalık", "hediye kartı"],
                      "kozmetik": [
                        "parfüm",
                        ["dudak parlatıcısı", "dudak parlatıcı"],
                        "vücut spreyi", "koku seti", "spray$", "oda kokusu", "dudak Dolgunlaştırıcı"
                      ],
                      "cilt bakımı": [
                        "vücut kremi", "duş jeli", "vücut peelingi", "vücut yağı", "nemlendirici",
                        "vücut losyonu", "dudak bakımı seti", "dudak yağı", "DUDAK NEMLENDİRİCİ",
                        "dudak kremi", "el kremi", "vücut bakım ritüeli", "dudak peelingi",
                        "göz serumu", "peptit serum", "yüz kremi", "güneş koruyucu krem",
                        "yüz temizleme jeli", "Göz ve Dudak Makyaj Temizleyicisi", "yüz maskesi"
                      ],
                      "hijyen": ["şampuan", "sabun"],
                      "takı": [
                        ["kolye", "necklace"],
                        ["küpe", "earrings"],
                        ["bileklik", "bracelet"],
                        "taç$",
                        ["broş", "Brosch", "brooch"],
                        ["yüzük", "ring"],
                        "bilezik"
                      ]
                    }
                  ]
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
                                                    // { $regexMatch: { input: "$link", regex: { $concat: ["(?i)", "$$variant"] } } }
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
                                                  /*   { $regexMatch: { input: "$link", regex: { $concat: ["(?i)", "$$variant"] } } } */
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
            h4: {
              $cond: {
                if: { $or: [{ $eq: [{ $type: "$h4" }, "missing"] }, { $eq: ["$h4", "diğer"] }] },
                then: "$productNames.matchedProduct",
                else: "$h4"
              }
            }
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